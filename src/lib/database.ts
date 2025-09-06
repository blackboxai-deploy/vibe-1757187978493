import { promises as fs } from 'fs';
import path from 'path';

export interface Post {
  id: string;
  category: 'kritik-saran' | 'curhat' | 'ide-opini';
  title?: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  target?: string;
  timestamp: string;
  reactions?: { [emoji: string]: number };
  votes?: { up: number; down: number };
  commentsCount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  timestamp: string;
  reactions?: { [emoji: string]: number };
}

export interface VotingOption {
  id: string;
  text: string;
  votes: number;
}

export interface VotingResponse {
  id: string;
  voterId: string;
  voterName?: string;
  optionId: string;
  timestamp: string;
}

export interface Voting {
  id: string;
  title: string;
  description: string;
  type: 'binary' | 'likert';
  creator: string;
  isAnonymous: boolean;
  requireIdentity: boolean;
  options: VotingOption[];
  responses: VotingResponse[];
  createdAt: string;
  isActive: boolean;
}

export interface Database {
  posts: Post[];
  comments: Comment[];
  votings: Voting[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function ensureDbFile() {
  await ensureDataDir();
  try {
    await fs.access(DB_FILE);
  } catch {
    const initialData: Database = {
      posts: [],
      comments: [],
      votings: []
    };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

export async function readDatabase(): Promise<Database> {
  await ensureDbFile();
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { posts: [], comments: [], votings: [] };
  }
}

export async function writeDatabase(data: Database): Promise<void> {
  await ensureDataDir();
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}

export async function createPost(post: Omit<Post, 'id' | 'timestamp'>): Promise<Post> {
  const db = await readDatabase();
  const newPost: Post = {
    ...post,
    id: generateId(),
    timestamp: new Date().toISOString(),
    reactions: {},
    votes: post.category === 'ide-opini' ? { up: 0, down: 0 } : undefined,
    commentsCount: 0
  };
  
  db.posts.unshift(newPost);
  await writeDatabase(db);
  return newPost;
}

export async function getPosts(category?: string, limit?: number): Promise<Post[]> {
  const db = await readDatabase();
  let posts = db.posts;
  
  if (category) {
    posts = posts.filter(post => post.category === category);
  }
  
  if (limit) {
    posts = posts.slice(0, limit);
  }
  
  return posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getPostById(id: string): Promise<Post | null> {
  const db = await readDatabase();
  return db.posts.find(post => post.id === id) || null;
}

export async function updatePostReactions(postId: string, emoji: string, increment: boolean): Promise<void> {
  const db = await readDatabase();
  const post = db.posts.find(p => p.id === postId);
  
  if (post) {
    if (!post.reactions) post.reactions = {};
    if (!post.reactions[emoji]) post.reactions[emoji] = 0;
    
    if (increment) {
      post.reactions[emoji]++;
    } else {
      post.reactions[emoji] = Math.max(0, post.reactions[emoji] - 1);
    }
    
    await writeDatabase(db);
  }
}

export async function updatePostVotes(postId: string, voteType: 'up' | 'down'): Promise<void> {
  const db = await readDatabase();
  const post = db.posts.find(p => p.id === postId);
  
  if (post && post.votes) {
    post.votes[voteType]++;
    await writeDatabase(db);
  }
}

export async function createComment(comment: Omit<Comment, 'id' | 'timestamp'>): Promise<Comment> {
  const db = await readDatabase();
  const newComment: Comment = {
    ...comment,
    id: generateId(),
    timestamp: new Date().toISOString(),
    reactions: {}
  };
  
  db.comments.push(newComment);
  
  const post = db.posts.find(p => p.id === comment.postId);
  if (post) {
    post.commentsCount = (post.commentsCount || 0) + 1;
  }
  
  await writeDatabase(db);
  return newComment;
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const db = await readDatabase();
  return db.comments
    .filter(comment => comment.postId === postId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export async function updateCommentReactions(commentId: string, emoji: string, increment: boolean): Promise<void> {
  const db = await readDatabase();
  const comment = db.comments.find(c => c.id === commentId);
  
  if (comment) {
    if (!comment.reactions) comment.reactions = {};
    if (!comment.reactions[emoji]) comment.reactions[emoji] = 0;
    
    if (increment) {
      comment.reactions[emoji]++;
    } else {
      comment.reactions[emoji] = Math.max(0, comment.reactions[emoji] - 1);
    }
    
    await writeDatabase(db);
  }
}

export async function createVoting(voting: Omit<Voting, 'id' | 'createdAt' | 'responses'>): Promise<Voting> {
  const db = await readDatabase();
  const newVoting: Voting = {
    ...voting,
    id: generateId(),
    createdAt: new Date().toISOString(),
    responses: []
  };
  
  db.votings.unshift(newVoting);
  await writeDatabase(db);
  return newVoting;
}

export async function getVotings(limit?: number): Promise<Voting[]> {
  const db = await readDatabase();
  let votings = db.votings;
  
  if (limit) {
    votings = votings.slice(0, limit);
  }
  
  return votings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getVotingById(id: string): Promise<Voting | null> {
  const db = await readDatabase();
  return db.votings.find(voting => voting.id === id) || null;
}

export async function submitVote(votingId: string, response: Omit<VotingResponse, 'id' | 'timestamp'>): Promise<void> {
  const db = await readDatabase();
  const voting = db.votings.find(v => v.id === votingId);
  
  if (voting && voting.isActive) {
    const existingResponse = voting.responses.find(r => r.voterId === response.voterId);
    
    if (existingResponse) {
      const oldOption = voting.options.find(o => o.id === existingResponse.optionId);
      if (oldOption) oldOption.votes--;
      
      existingResponse.optionId = response.optionId;
      existingResponse.timestamp = new Date().toISOString();
    } else {
      const newResponse: VotingResponse = {
        ...response,
        id: generateId(),
        timestamp: new Date().toISOString()
      };
      voting.responses.push(newResponse);
    }
    
    const selectedOption = voting.options.find(o => o.id === response.optionId);
    if (selectedOption) {
      selectedOption.votes++;
    }
    
    await writeDatabase(db);
  }
}

export async function getStats(): Promise<{
  totalPosts: number;
  totalComments: number;
  totalVotings: number;
  postsByCategory: { [key: string]: number };
}> {
  const db = await readDatabase();
  
  const postsByCategory = db.posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  return {
    totalPosts: db.posts.length,
    totalComments: db.comments.length,
    totalVotings: db.votings.length,
    postsByCategory
  };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const EMOJI_REACTIONS = ['❤️', '😂', '😢', '👍', '😮', '😡'];

export const LIKERT_OPTIONS = [
  { id: '1', text: 'Sangat Tidak Setuju', value: 1 },
  { id: '2', text: 'Tidak Setuju', value: 2 },
  { id: '3', text: 'Netral', value: 3 },
  { id: '4', text: 'Setuju', value: 4 },
  { id: '5', text: 'Sangat Setuju', value: 5 }
];

export const BINARY_OPTIONS = [
  { id: 'agree', text: 'Setuju', value: 1 },
  { id: 'disagree', text: 'Tidak Setuju', value: 0 }
];