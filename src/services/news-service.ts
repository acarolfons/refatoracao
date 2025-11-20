import * as newsRepository from "../repositories/news-repository";
import { AlterNewsData, CreateNewsData } from "../repositories/news-repository";

const MIN_TEXT_LENGTH = 500;

export async function getNews() {
  return newsRepository.getNews(); 
}

export async function getSpecificNews(id: number) {
  const news = await newsRepository.getNewsById(id);
  if (!news) throw createError("NotFound", `News with id ${id} not found.`);
  return news;
}

export async function createNews(newsData: CreateNewsData) {
  await validateNews(newsData);
  return newsRepository.createNews(newsData);
}

export async function updateNews(id: number, newsData: AlterNewsData) {
  const existingNews = await getSpecificNews(id);
  const isTitleChanged = existingNews.title !== newsData.title;

  await validateNews(newsData, isTitleChanged);
  return newsRepository.updateNews(id, newsData);
}

export async function deleteNews(id: number) {
  await getSpecificNews(id);
  return newsRepository.removeNews(id);
}

async function validateNews(newsData: CreateNewsData, checkTitle = true) {
  if (checkTitle) await validateTitleUnique(newsData.title);
  validateTextLength(newsData.text);
  validatePublicationDate(newsData.publicationDate);
}

async function validateTitleUnique(title: string) {
  const existingNews = await newsRepository.getNews().then(newsList =>
    newsList.find(news => news.title === title)
  );

  if (existingNews) throw createError("Conflict", `News with title "${title}" already exists.`);
}

function validateTextLength(text: string) {
  if (text.length < MIN_TEXT_LENGTH) {
    throw createError(
      "BadRequest",
      `The news text must be at least ${MIN_TEXT_LENGTH} characters long.`
    );
  }
}

function validatePublicationDate(date: string | Date) {
  const publicationDate = new Date(date);
  const now = new Date();

  if (publicationDate.getTime() < now.getTime()) {
    throw createError("BadRequest", "The publication date cannot be in the past.");
  }
}

function createError(name: string, message: string) {
  return { name, message };
}