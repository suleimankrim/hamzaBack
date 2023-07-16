import ModelCell from '../model/CellModel.js';

// Controller actions
const getAllCells = async (req, res) => {
    try {
        // const cells = await ModelCell.find().sort({rowId:'asc', columnId:'asc'}).select(["rowId","value"]);
        // const decomposedCells = [];
        // let currentRowId = null;
        // let currentRowObj = { rowId: null };
        // let finalRowObj = { id: null};

        // cells.forEach((cell) => {
        //     if (cell.rowId !== currentRowId) {
        //         if (currentRowObj.rowId !== null) {
        //             const change = currentRowObj.cells
        //             const current ={}
        //             for (let i = 0; i < change.length; i++) {
        //                 finalRowObj[`${i}`] = change[i];
        //             }
        //             finalRowObj = { id: currentRowId }
        //             decomposedCells.push(finalRowObj);
        //         }
        //         currentRowId = cell.rowId;
        //         currentRowObj = { id: currentRowId, cells: [cell?.value?cell.value:""] };
        //     } else {
        //         currentRowObj.cells.push(cell.value);
        //     }
        // });
//         const cells = await ModelCell.find().sort({ rowId: 'asc', columnId: 'asc' }).select(['rowId', 'colId', 'value']);
// const rowMap = new Map();

// cells.forEach((cell) => {
//   const { rowId, colId, value } = cell;
//   if (rowMap.has(rowId)) {
//     rowMap.get(rowId).push({ colId, value });
//     // points.sort(function(a, b){return a - b});
//     rowMap.get(rowId).sort((a, b) => a.colId-b.colId);
//   } else {
//     rowMap.set(rowId, [{ colId, value }]);
//   }
// });

// const decomposedCells = [];
// rowMap.forEach((values, rowId) => {
//   decomposedCells.push({ id: rowId, cells: values });
// });

// res.json(decomposedCells);
const cells = await ModelCell.find().sort({ rowId: 'asc', colId: 'asc' }).select(['rowId', 'colId', 'value']);
const rowMap = new Map();

cells.forEach((cell) => {
  const { rowId, colId, value } = cell;
  if (rowMap.has(rowId)) {
    rowMap.get(rowId)[colId] = value;
  } else {
    rowMap.set(rowId, { [colId]: value });
  }
});

const decomposedCells = [];
rowMap.forEach((values, rowId) => {
  const formattedValues = {};
  Object.keys(values).forEach((key) => {
    const formattedKey = key.replace('colId', '');
    formattedValues[formattedKey] = values[key];
  });
  decomposedCells.push({ id: rowId, ...formattedValues });
  decomposedCells.sort((a, b) => a.id-b.id);
});

res.json(decomposedCells);


// Add the last row object
        // if (currentRowObj.rowId !== null) {
        //    // decomposedCells.push(currentRowObj);
        // }
        // res.json(decomposedCells);
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
            // console.log(cell.rowId+" "+ cell.colId);
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

        for (let i = 0; i < 95; i++) {
            for (let j = 0; j <26 ; j++) {
                if(j===0){
                    const newCell = new ModelCell({rowId: i, colId: j, value:`${i}`});

                emptyCells.push(newCell);
                }
                else{
                const newCell = new ModelCell({rowId: i, colId: j, value:""});
                emptyCells.push(newCell);
                }
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
