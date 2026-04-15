# Distributed Voting System 🗳️

A real-time distributed voting system with admin dashboard, live vote tracking, and graph visualization.

## Features

### User Side
- ✅ Enter name and unique ID
- ✅ Select from multiple candidates
- ✅ Submit vote with confirmation
- ✅ See live vote counts
- ✅ Real-time updates

### Admin Dashboard
- ✅ Live vote counts and statistics
- ✅ Bar chart and pie chart visualization
- ✅ Voter details table
- ✅ Toggle voting status (open/close)
- ✅ Reset all votes
- ✅ Export results to JSON

### Distributed System Concepts
- ✅ **Consistency**: One user = One vote (unique ID tracking)
- ✅ **Concurrency**: Multiple users voting simultaneously
- ✅ **Fault Tolerance**: Duplicate prevention and data validation
- ✅ **Real-time Communication**: WebSockets via Socket.IO

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Chart.js
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO (WebSockets)
- **Security**: Helmet, CORS, Rate Limiting
- **Data Storage**: In-memory (production: MongoDB/PostgreSQL recommended)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone or download the project**
   ```bash
   cd distributed-voting-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Access the application**
   - User Voting Interface: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin

## Usage

### For Voters
1. Open http://localhost:3000
2. Enter your name and unique ID (email or student ID)
3. Select a candidate by clicking on their card
4. Click "Submit Vote"
5. Receive confirmation and see live results

### For Administrators
1. Open http://localhost:3000/admin
2. Monitor live voting statistics
3. View real-time charts (bar and pie)
4. Manage voting status (open/close)
5. Reset votes when needed
6. Export results for analysis

## API Endpoints

### REST API
- `GET /api/candidates` - Get all candidates
- `GET /api/results` - Get current voting results
- `GET /api/voters` - Get voter details (admin only)

### Socket.IO Events
- `submit-vote` - Submit a vote
- `vote-updated` - Real-time vote updates
- `vote-confirmed` - Vote confirmation
- `vote-error` - Vote error messages
- `reset-votes` - Reset all votes
- `toggle-voting` - Toggle voting status

## Security Features

- **Rate Limiting**: Prevents spam voting (100 requests per 15 minutes)
- **Input Validation**: Server-side validation for all inputs
- **Duplicate Prevention**: Unique ID tracking prevents multiple votes
- **CORS Protection**: Cross-origin request protection
- **Helmet**: Security headers for Express.js

## Testing

### Concurrent Voting Test
1. Open multiple browser tabs or devices
2. Use different unique IDs for each voter
3. Vote simultaneously to test concurrency
4. Observe real-time updates across all clients

### Fault Tolerance Test
1. Try voting with the same ID twice
2. Verify duplicate prevention works
3. Test voting when system is closed
4. Verify error handling

## Production Deployment

### Database Integration
Replace in-memory storage with a database:

```javascript
// Example MongoDB integration
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voterId: { type: String, unique: true },
  voterName: String,
  candidateId: Number,
  timestamp: { type: Date, default: Date.now }
});

const Vote = mongoose.model('Vote', voteSchema);
```

### Environment Variables
Create `.env` file:
```
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://localhost/voting-system
JWT_SECRET=your-secret-key
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Configuration

### Adding Candidates
Modify `server.js` to add more candidates:
```javascript
candidates: [
  { id: 1, name: 'Candidate A', votes: 0, color: '#FF6384' },
  { id: 2, name: 'Candidate B', votes: 0, color: '#36A2EB' },
  // Add more candidates here
]
```

### Customizing Colors
Update the `color` property for each candidate to match your theme.

## Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT in environment variables
2. **Socket connection issues**: Check firewall and network settings
3. **Duplicate votes not prevented**: Verify unique ID validation
4. **Charts not updating**: Check browser console for JavaScript errors

### Debug Mode
Enable debug logging:
```bash
DEBUG=socket.io:* npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Future Enhancements

- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] User authentication system
- [ ] Mobile app support
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Audit logging
- [ ] Load balancing for high traffic

## Support

For issues and questions, please open an issue on the GitHub repository or contact the development team.

---

**Note**: This system is designed for educational and demonstration purposes. For production use in official elections, additional security measures and compliance requirements should be implemented.
