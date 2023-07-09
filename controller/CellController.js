import ModelCell from '../model/CellModel.js';

// Controller actions
const getAllCells = async (req, res) => {
    try {
        const cells = await ModelCell.find().sort({rowId:'asc', columnId:'asc'}).select(["rowId","value"]);
        const decomposedCells = [];
        let currentRowId = null;
        let currentRowObj = { rowId: null, cells: [] };
        let finalRowObj = { rowId: null, cells: {} };

        cells.forEach((cell) => {
            if (cell.rowId !== currentRowId) {
                if (currentRowObj.rowId !== null) {
                    const change = currentRowObj.cells
                    const current ={}
                    for (let i = 0; i < change.length; i++) {
                        current[`${i}`] = change[i];
                    }
                    finalRowObj = { rowId: currentRowId, cells: current }
                    decomposedCells.push(finalRowObj);
                }
                currentRowId = cell.rowId;
                currentRowObj = { rowId: currentRowId, cells: [cell?.value?cell.value:""] };
            } else {
                currentRowObj.cells.push(cell.value);
            }
        });

// Add the last row object
        if (currentRowObj.rowId !== null) {
            decomposedCells.push(currentRowObj);
        }
        res.json(decomposedCells);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createCell = async (req, res) => {
    try {
        const { rowId, colId, value } = req.body;
        const newCell = new ModelCell({  rowId, colId, value });
        const savedCell = await newCell.save();
        res.status(201).json(savedCell);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
};

const getAllCellsByRowId = async (req, res) => {
    try {
        const { rowId } = req.params;
        const cells = await ModelCell.find({ rowId });
        res.json(cells);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCellByRowAndCol = async (req, res) => {
    try {
        const { rowId, colId } = req.params;
        const cell = await ModelCell.findOne({ rowId, colId });
        if (cell) {
            res.json(cell);
        } else {
            res.status(404).json({ error: 'Cell not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const postCellByRowAndCol = async (req, res) => {
    try {
        const { rowId, colId } = req.params;
        const { value } = req.body;

        let cell = await ModelCell.findOne({rowId, colId });
        if (cell) {
            cell.value = value;
        } else {
            cell = new ModelCell({ rowId, colId, value });
        }

        const savedCell = await cell.save();
        res.json(savedCell);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createEmptyCells = async (req, res) => {
    try {
        const emptyCells = [];

        for (let i = 0; i < 150; i++) {
            for (let j = 0; j <26 ; j++) {
                const newCell = new ModelCell({rowId: i, colId: j, value:""});
                emptyCells.push(newCell);
            }

        }

        const savedCells = await ModelCell.create(emptyCells);
        res.status(201).json(savedCells);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export  {
    getAllCells,
    createCell,
    getCellByRowAndCol,
    postCellByRowAndCol,
    getAllCellsByRowId,
    createEmptyCells
};
