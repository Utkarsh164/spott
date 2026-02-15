"use client";
import React from "react";
import z from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters longs"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters longs"),
  category: z.string().min(1, "Category must be at least 3 characters long"),

  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().regex(timeRegex, "Start tiem must be HH:MM"),
  endTime: z.string().regex(timeRegex, "End tiem must be HH:MM"),

  locationType: z.enum(["physical", "online"]).default("physical"),
  venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),

  capacity: z.number().min(1, "Capacity must be at least 1"),
  ticketType: z.enum(["free", "paid"]).default("free"),
  ticketPrice: z.number().optional(),
  coverImage: z.string().optional(),
  themeColor: z.string().default("#1e3a8a"),
});
const CreateEvents = () => {
  return <div>i wannna cry</div>;
};

export default CreateEvents;
