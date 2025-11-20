import { Request, Response } from "express";
import httpStatus from "http-status";

import * as service from "./../services/news-service";
import { AlterNewsData, CreateNewsData } from "../repositories/news-repository";

function validateId(id: string) {
  const parsedId = parseInt(id);
  if (isNaN(parsedId) || parsedId <= 0) {
    throw { name: "BadRequest", message: "Id is not valid." };
  }
  return parsedId;
}

export async function getNews(req: Request, res: Response) {
  const { page, order, title } = req.query;
  const news = await service.getNews({
    page: page ? parseInt(page as string) : undefined,
    order: order as "asc" | "desc" | undefined,
    title: title as string | undefined
  });
  return res.send(news);
}

export async function getSpecificNews(req: Request, res: Response) {
  const id = validateId(req.params.id);
  const news = await service.getSpecificNews(id);
  return res.send(news);
}

export async function createNews(req: Request, res: Response) {
  const newsData = req.body as CreateNewsData;
  const createdNews = await service.createNews(newsData);
  return res.status(httpStatus.CREATED).send(createdNews);
}

export async function alterNews(req: Request, res: Response) {
  const id = validateId(req.params.id);
  const newsData = req.body as AlterNewsData;
  const alteredNews = await service.updateNews(id, newsData);
  return res.send(alteredNews);
}

export async function deleteNews(req: Request, res: Response) {
  const id = validateId(req.params.id);
  await service.deleteNews(id);
  return res.sendStatus(httpStatus.NO_CONTENT);
}