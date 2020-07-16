import {Router} from "express";

export interface App {
    getRouter(): Router;
}
