import prisma from "./../database";
import { News } from "@prisma/client";

export type CreateNewsData = Omit<News, "id" | "createAt">;
export type AlterNewsData = CreateNewsData;

const ORDER_DESC = "desc";

function parseDate(date: string | Date) {
  return new Date(date);
}

export interface GetNewsWithFiltersParams {
  page: number;
  order: "asc" | "desc";
  title?: string;
}

export async function getNewsWithFilters(params: GetNewsWithFiltersParams) {
  const take = 10;
  const skip = (params.page - 1) * take;

  return prisma.news.findMany({
    where: params.title ? {
      title: { contains: params.title, mode: "insensitive" }
    } : {},
    orderBy: {
      publicationDate: params.order
    },
    skip,
    take
  });
}

export function getNews() {
  return prisma.news.findMany({
    orderBy: {
      publicationDate: ORDER_DESC
    }
  });
}

export function getNewsById(id: number) {
  return prisma.news.findUnique({
    where: { id }
  });
}

export async function createNews(newsData: CreateNewsData) {
  return prisma.news.create({
    data: { ...newsData, publicationDate: parseDate(newsData.publicationDate) }
  });
}

export async function updateNews(id: number, news: AlterNewsData) {
  return prisma.news.update({
    where: { id },
    data: { ...news, publicationDate: parseDate(news.publicationDate) }
  });
}

export async function removeNews(id: number) {
  return prisma.news.delete({
    where: { id }
  });
}

export function getNoticias() {
  throw new Error("Function not implemented.");
}
export function createNoticia(newsData: CreateNewsData) {
  throw new Error("Function not implemented.");
}

