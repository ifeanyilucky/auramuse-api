import { Request, Response } from "express";

export const getExample = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Example GET request successful",
  });
};

export const createExample = (req: Request, res: Response) => {
  const { data } = req.body;

  res.status(201).json({
    status: "success",
    message: "Example POST request successful",
    data,
  });
};
