import JobDesc from "@/components/JobDesc";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

interface AdminSlugProps {
  params: { slug: string };
}

const AdminSlug = async ({ params: { slug } }: AdminSlugProps) => {
  const job = await prisma.job.findUnique({
    where: {
      slug,
    },
  });
  if (!job) notFound();
  return (
    <main className="m-auto my-10 flex max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
      <JobDesc job={job} />
      <AdminSidebar job={job} />
    </main>
  );
};

export default AdminSlug;
