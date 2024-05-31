"use server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type FormState = { error?: string } | undefined;

export async function approveSubmission(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    // get job post id
    const jobId = parseInt(formData.get("jobId") as string);

    // get current user
    const user = await currentUser();

    // Check if user isAdmin
    if (!user || !isAdmin(user)) {
      throw new Error("Not authorized!");
    }

    // Update job in db
    await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        approved: true,
      },
    });

    revalidatePath("/");
  } catch (error) {
    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}

export async function deleteJob(prevState: FormState, formData: FormData) {
  try {
    // get job post id
    const jobId = parseInt(formData.get("jobId") as string);

    // get current user
    const user = await currentUser();

    // Check if user isAdmin
    if (!user || !isAdmin(user)) {
      throw new Error("Not authorized!");
    }

    //   find job in db
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    // Delete Logo if any
    if (job?.companyLogoUrl) {
      await del(job.companyLogoUrl);
    }

    //   Delete job from db
    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });

    revalidatePath("/");
  } catch (error) {
    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }

  redirect("/admin");
}
