const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.socket.io", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// In-memory storage (replace with database in production)
let votingData = {
  candidates: [
    { id: 1, name: 'Candidate A', votes: 0, color: '#FF6384' },
    { id: 2, name: 'Candidate B', votes: 0, color: '#36A2EB' },
    { id: 3, name: 'Candidate C', votes: 0, color: '#FFCE56' },
    { id: 4, name: 'Candidate D', votes: 0, color: '#4BC0C0' }
  ],
  voters: new Map(), // voterId -> { name, timestamp, candidateId }
  totalVotes: 0,
  isActive: true
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Send current voting data to new client
  socket.emit('voting-data', {
    candidates: votingData.candidates,
    totalVotes: votingData.totalVotes,
    isActive: votingData.isActive
  });
  
  // Handle vote submission
  socket.on('submit-vote', (voteData) => {
    const { voterName, voterId, candidateId } = voteData;
    
    // Validate vote
    if (!votingData.isActive) {
      socket.emit('vote-error', { message: 'Voting is currently closed' });
      return;
    }
    
    // Check for duplicate vote
    if (votingData.voters.has(voterId)) {
      socket.emit('vote-error', { message: 'You have already voted' });
      return;
    }
    
    // Validate candidate
    const candidate = votingData.candidates.find(c => c.id === candidateId);
    if (!candidate) {
      socket.emit('vote-error', { message: 'Invalid candidate selected' });
      return;
    }
    
    // Record vote
    const voteRecord = {
      name: voterName,
      timestamp: new Date().toISOString(),
      candidateId: candidateId
    };
    
    votingData.voters.set(voterId, voteRecord);
    candidate.votes++;
    votingData.totalVotes++;
    
    // Broadcast updated data to all clients
    const updatedData = {
      candidates: votingData.candidates,
      totalVotes: votingData.totalVotes,
      isActive: votingData.isActive
    };
    
    io.emit('vote-updated', updatedData);
    
    // Send confirmation to voter
    socket.emit('vote-confirmed', {
      message: 'Your vote has been recorded successfully!',
      candidate: candidate.name,
      timestamp: voteRecord.timestamp
    });
    
    console.log(`Vote recorded: ${voterName} voted for ${candidate.name}`);
  });
  
  // Handle admin reset request
  socket.on('reset-votes', () => {
    votingData.candidates.forEach(candidate => {
      candidate.votes = 0;
    });
    votingData.voters.clear();
    votingData.totalVotes = 0;
    
    const resetData = {
      candidates: votingData.candidates,
      totalVotes: votingData.totalVotes,
      isActive: votingData.isActive
    };
    
    io.emit('votes-reset', resetData);
    console.log('Votes have been reset by admin');
  });
  
  // Handle voting status toggle
  socket.on('toggle-voting', (isActive) => {
    votingData.isActive = isActive;
    io.emit('voting-status-changed', { isActive });
    console.log(`Voting ${isActive ? 'opened' : 'closed'}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// REST API endpoints
app.get('/api/candidates', (req, res) => {
  res.json(votingData.candidates);
});

app.get('/api/results', (req, res) => {
  res.json({
    candidates: votingData.candidates,
    totalVotes: votingData.totalVotes,
    isActive: votingData.isActive
  });
});

app.get('/api/voters', (req, res) => {
  const votersArray = Array.from(votingData.voters.entries()).map(([id, data]) => ({
    id,
    ...data,
    candidateName: votingData.candidates.find(c => c.id === data.candidateId)?.name
  }));
  res.json(votersArray);
});

// Serve main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Distributed Voting System running on port ${PORT}`);
  console.log(`User interface: http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
});
