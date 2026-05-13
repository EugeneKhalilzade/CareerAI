"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';

function Interviewlist() {
    const {user}=useUser();
    const [interviewList,setInterviewList]=useState([])
    useEffect(()=>{
         user&& GetInterviewList()
    },[user])
    const GetInterviewList=async()=>{
        const result=await db.select().from(MockInterview).where(eq(MockInterview.createdBy,user?.primaryEmailAddress?.emailAddress)).orderBy(desc(MockInterview.id))
        setInterviewList(result)
    }
  return (
    <div className='space-y-4'>
        <div>
          <h2 className='text-2xl font-semibold text-slate-900'>Your previous interviews</h2>
          <p className='mt-1 text-sm text-slate-600'>
            Open any session to continue practicing or review your feedback.
          </p>
        </div>
        {interviewList?.length === 0 ? (
          <div className='glass-card p-6 text-sm text-slate-600'>
            You haven&apos;t created an interview yet. Start with the card above to generate your first session.
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
              {
                  interviewList&&interviewList.map((interview,index)=>(
                      <InterviewItemCard key={index} interviewInfo={interview} />                ))
              }
          </div>
        )}
    </div>
  )
}

export default Interviewlist
