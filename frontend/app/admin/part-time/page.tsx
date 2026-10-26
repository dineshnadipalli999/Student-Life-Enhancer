"use client";
import PageHeader from "@/components/layout/PageHeader"; import OpportunityForm from "@/components/admin/OpportunityForm";
export default function Page(){return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7"><PageHeader title="Part-Time Management" description="Add part-time listings that students can view and apply to."/><OpportunityForm type="PART_TIME"/></main>}
