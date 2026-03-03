from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlmodel import select
from .models import Product
from .db import get_session

router = APIRouter(prefix="/api/products", tags=["products"])

# Import auth utilities
from fastapi import Header, status
from .auth_routes import get_admin_from_token, log_admin_action, get_admin_permissions


@router.get("/", response_model=List[Product])
def list_products(
    q: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = 20,
    offset: int = 0,
    session=Depends(get_session),
):
    statement = select(Product)

    if q:
        # case-insensitive search on name and description
        statement = statement.where(
            (Product.name.ilike(f"%{q}%")) | (Product.description.ilike(f"%{q}%"))
        )

    if category:
        statement = statement.where(Product.category == category)

    statement = statement.offset(offset).limit(limit)
    results = session.exec(statement).all()
    return results


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int, session=Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=Product)
def create_product(
    product: Product,
    session=Depends(get_session),
    admin=Depends(get_admin_from_token),
):
    """Create a new product in the database"""
    # Check permissions
    permissions = get_admin_permissions(admin.id, session)
    if not permissions.can_create_product:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to create products",
        )
    
    try:
        session.add(product)
        session.commit()
        session.refresh(product)
        
        # Log action
        log_admin_action(
            admin_id=admin.id,
            action="create_product",
            entity_type="product",
            entity_id=product.id,
            details=f"Created product: {product.name}",
            session=session,
        )
        
        return product
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating product: {str(e)}")


@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    product_update: Product,
    session=Depends(get_session),
    admin=Depends(get_admin_from_token),
):
    """Update an existing product"""
    # Check permissions
    permissions = get_admin_permissions(admin.id, session)
    if not permissions.can_edit_product:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to edit products",
        )
    
    db_product = session.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    try:
        for key, value in product_update.dict(exclude_unset=True).items():
            setattr(db_product, key, value)
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        
        # Log action
        log_admin_action(
            admin_id=admin.id,
            action="update_product",
            entity_type="product",
            entity_id=product_id,
            details=f"Updated product: {db_product.name}",
            session=session,
        )
        
        return db_product
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Error updating product: {str(e)}")


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    session=Depends(get_session),
    admin=Depends(get_admin_from_token),
):
    """Delete a product"""
    # Check permissions
    permissions = get_admin_permissions(admin.id, session)
    if not permissions.can_delete_product:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete products",
        )
    
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    try:
        session.delete(product)
        session.commit()
        
        # Log action
        log_admin_action(
            admin_id=admin.id,
            action="delete_product",
            entity_type="product",
            entity_id=product_id,
            details=f"Deleted product: {product.name}",
            session=session,
        )
        
        return {"message": f"Product {product_id} deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Error deleting product: {str(e)}")
