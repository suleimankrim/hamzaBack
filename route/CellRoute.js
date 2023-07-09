 import express from "express";
 import * as cellController from "../controller/CellController.js";
 import sheet from "../excelHelper/excel.js"
const router = express.Router();
router.get('/cells', cellController.getAllCells);
router.post('/cells', cellController.createCell);
router.get('/cells/:rowId/:colId', cellController.getCellByRowAndCol);
router.post('/cells/:rowId/:colId', cellController.postCellByRowAndCol);
router.get('/cells/row/:rowId', cellController.getAllCellsByRowId);
 router.get('/createTable', cellController.createEmptyCells);
 router.get('/e', sheet);
export default router;
