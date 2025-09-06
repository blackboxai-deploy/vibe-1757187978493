import { NextRequest, NextResponse } from 'next/server';
import { getAllVotings, getVotingById, createVoting, addVotingResponse } from '@/lib/database';
import { VotingFormData, ApiResponse, Voting, VotingResponse } from '@/lib/types';
import { BINARY_OPTIONS, LIKERT_OPTIONS } from '@/lib/constants';

// GET /api/voting - Get all votings or specific voting by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const voting = await getVotingById(id);
      if (!voting) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Voting not found'
        };
        return NextResponse.json(response, { status: 404 });
      }
      
      const response: ApiResponse<Voting> = {
        success: true,
        data: voting
      };
      return NextResponse.json(response);
    } else {
      const votings = await getAllVotings();
      const response: ApiResponse<Voting[]> = {
        success: true,
        data: votings
      };
      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Error fetching voting:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch voting data'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/voting - Create new voting or submit vote response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is creating a new voting or submitting a response
    if (body.votingId && body.optionId) {
      // This is a vote submission
      const { votingId, optionId, voter, isAnonymous } = body;
      
      if (!votingId || !optionId) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'votingId and optionId are required'
        };
        return NextResponse.json(response, { status: 400 });
      }
      
      const responseData = {
        optionId,
        voter: isAnonymous ? 'Anonim' : (voter || 'Anonim'),
        isAnonymous: isAnonymous || false
      };
      
      const newResponse = await addVotingResponse(votingId, responseData);
      
      if (!newResponse) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Voting not found'
        };
        return NextResponse.json(response, { status: 404 });
      }
      
      const response: ApiResponse<VotingResponse> = {
        success: true,
        data: newResponse,
        message: 'Vote submitted successfully'
      };
      
      return NextResponse.json(response, { status: 201 });
    } else {
      // This is creating a new voting
      const votingData: VotingFormData = body;
      
      // Validation
      if (!votingData.title || votingData.title.trim().length < 5) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Title must be at least 5 characters long'
        };
        return NextResponse.json(response, { status: 400 });
      }
      
      if (!votingData.isAnonymous && (!votingData.creator || votingData.creator.trim().length < 2)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Creator name is required for non-anonymous voting'
        };
        return NextResponse.json(response, { status: 400 });
      }
      
      // Create voting options based on type
      const options = votingData.type === 'binary' ? BINARY_OPTIONS : LIKERT_OPTIONS;
      
      const newVotingData = {
        title: votingData.title.trim(),
        description: votingData.description?.trim() || '',
        type: votingData.type,
        creator: votingData.isAnonymous ? 'Anonim' : votingData.creator.trim(),
        isAnonymous: votingData.isAnonymous,
        requireIdentity: votingData.requireIdentity,
        options: options,
        isActive: true
      };
      
      const newVoting = await createVoting(newVotingData);
      
      const response: ApiResponse<Voting> = {
        success: true,
        data: newVoting,
        message: 'Voting created successfully'
      };
      
      return NextResponse.json(response, { status: 201 });
    }
  } catch (error) {
    console.error('Error processing voting request:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to process voting request'
    };
    return NextResponse.json(response, { status: 500 });
  }
}