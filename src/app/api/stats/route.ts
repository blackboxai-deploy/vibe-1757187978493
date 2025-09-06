import { NextResponse } from 'next/server';
import { getDatabaseStats } from '@/lib/database';
import { ApiResponse, DatabaseStats } from '@/lib/types';

// GET /api/stats - Get database statistics
export async function GET() {
  try {
    const stats = await getDatabaseStats();
    
    const response: ApiResponse<DatabaseStats> = {
      success: true,
      data: stats
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch statistics'
    };
    return NextResponse.json(response, { status: 500 });
  }
}