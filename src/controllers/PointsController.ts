import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;
    let points;
    if (items) {
      const parsedItems = String(items)
        .split(",")
        .map((item) => Number(item.trim()));

      points = await knex("points")
        .join("point_items", "points.id", "=", "point_items.point_id")
        .whereIn("point_items.item_id", parsedItems)
        .where("city", String(city))
        .where("uf", String(uf))
        .distinct()
        .select("points.*");
    } else {
      points = await knex("points")
        .where("city", String(city))
        .where("uf", String(uf))
        .distinct()
        .select("points.*");
    }

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image: `${process.env.UPLOADS_URL + point.image}`,
      };
    });

    return response.json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex("points").where("id", id).first();

    if (!point) {
      return response.status(400).json({ message: "Point not found" });
    }

    const serializedPoint = {
      ...point,
      image: `${process.env.UPLOADS_URL + point.image}`,
    };

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

    return response.json({ point: serializedPoint, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedIds = await trx("points").insert(point, "id");
    console.log("insertedIds", insertedIds);
    const point_id = insertedIds[0];
    console.log("point_id", point_id);
    const pointItems = items
      .split(",")
      .map((item: string) => item.trim())
      .map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

    try {
      await trx("point_items").insert(pointItems);

      await trx.commit();
    } catch (error) {
      await trx.rollback();

      return response.status(400).json({
        message:
          "Falha na inserção da tabela point_items, verifique se os items informados são válidos",
        error,
      });
    }

    return response.json({ id: point_id, ...point });
  }
}

export default PointsController;
