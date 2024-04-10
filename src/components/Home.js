import { Link } from "react-router-dom";
import MemoryAllocation from "./MemoryAllocation";
import React, { useState } from "react";

function Home() {
  const [blockSizes, setBlockSizes] = useState([]);
  const [processSizes, setProcessSizes] = useState([]);
  const [algorithm, setAlgorithm] = useState("");

  const handleBlockSizeChange = (event) => {
    const sizes = event.target.value
      .split(",")
      .map((size) => parseInt(size.trim(), 10));
    setBlockSizes(sizes);
  };

  const handleProcessSizeChange = (event) => {
    const sizes = event.target.value
      .split(",")
      .map((size) => parseInt(size.trim(), 10));
    setProcessSizes(sizes);
  };

  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
  };
  return (
    <div>
      <h1 className="text-center py-4 my-3">Memory Allocation System</h1>
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <label htmlFor="blockSizes " className="h4">
              Block Sizes :
            </label>
            <input
              className="form-control "
              type="text"
              id="blockSizes"
              placeholder="Enter number separated by commas"
              onChange={handleBlockSizeChange}
            />
          </div>
          <div className="col-sm-6">
            <label htmlFor="processSizes " className="h4">
              Process Sizes :
            </label>
            <input
              className="form-control"
              placeholder="Enter number separated by commas"
              type="text"
              id="processSizes"
              onChange={handleProcessSizeChange}
            />
          </div>
        </div>
        <div className="my-3  text-center mt-5">
          <label htmlFor="algorithm" className="h4">
            Select Algorithm :
          </label>
          <select
            id="algorithm"
            onChange={handleAlgorithmChange}
            className="form-select"
          >
            <option value="">Select...</option>
            <option value="firstFit">First Fit</option>
            <option value="nextFit">Next Fit</option>
            <option value="bestFit">Best Fit</option>
            <option value="worstFit">Worst Fit</option>
          </select>
        </div>

        {algorithm && (
          <MemoryAllocation
            blockSizes={blockSizes}
            processSizes={processSizes}
            algorithm={algorithm}
          />
        )}
      </div>
      {/* <Link to="/compare">
        <button>Compare Algorithms</button>
      </Link> */}
    </div>
  );
}

export default Home;
