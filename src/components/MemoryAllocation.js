import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LinearScale,
  BarController,
  CategoryScale,
  BarElement,
} from "chart.js";
Chart.register(LinearScale, BarController, CategoryScale, BarElement);

function MemoryAllocation({ blockSizes, processSizes, algorithm }) {
  const [allocation, setAllocation] = useState([]);
  const [comparisons, setComparisons] = useState([]);

  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  const allocateMemory = () => {
    let allocationResult;
    switch (algorithm) {
      case "firstFit":
        allocationResult = firstFit([...blockSizes], processSizes);
        break;
      case "nextFit":
        allocationResult = nextFit([...blockSizes], processSizes);
        break;
      case "bestFit":
        allocationResult = bestFit([...blockSizes], processSizes);
        break;
      case "worstFit":
        allocationResult = worstFit([...blockSizes], processSizes);
        break;
      default:
        allocationResult = [];
        break;
    }
    setAllocation(allocationResult);
  };

  let firstFit = (blockSizes, processSizes) => {
    const allocation = [];
    // Create a copy of blockSizes
    const remainingBlockSizes = [...blockSizes];
    for (let i = 0; i < processSizes.length; i++) {
      let allocationFound = false;
      for (let j = 0; j < remainingBlockSizes.length; j++) {
        if (remainingBlockSizes[j] >= processSizes[i]) {
          allocation[i] = j;
          remainingBlockSizes[j] -= processSizes[i];
          allocationFound = true;
          break;
        }
      }
      if (!allocationFound) {
        allocation[i] = -1;
      }
    }
    return allocation;
  };

  let nextFit = (blockSizes, processSizes) => {
    const allocation = [];
    let nextFitIndex = 0;
    for (let i = 0; i < processSizes.length; i++) {
      let allocationFound = false;
      for (let j = 0; j < blockSizes.length; j++) {
        let index = (nextFitIndex + j) % blockSizes.length;
        if (blockSizes[index] >= processSizes[i]) {
          allocation[i] = index;
          blockSizes[index] -= processSizes[i];
          nextFitIndex = (index + 1) % blockSizes.length;
          allocationFound = true;
          break;
        }
      }
      if (!allocationFound) {
        allocation[i] = -1;
      }
    }
    return allocation;
  };

  let bestFit = (blockSizes, processSizes) => {
    const allocation = [];
    for (let i = 0; i < processSizes.length; i++) {
      let bestIdx = -1;
      for (let j = 0; j < blockSizes.length; j++) {
        if (blockSizes[j] >= processSizes[i]) {
          if (bestIdx === -1 || blockSizes[j] < blockSizes[bestIdx]) {
            bestIdx = j;
          }
        }
      }
      if (bestIdx !== -1) {
        allocation[i] = bestIdx;
        blockSizes[bestIdx] -= processSizes[i];
      } else {
        allocation[i] = -1;
      }
    }
    return allocation;
  };

  let worstFit = (blockSizes, processSizes) => {
    const allocation = [];
    for (let i = 0; i < processSizes.length; i++) {
      let worstIdx = -1;
      for (let j = 0; j < blockSizes.length; j++) {
        if (blockSizes[j] >= processSizes[i]) {
          if (worstIdx === -1 || blockSizes[worstIdx] < blockSizes[j]) {
            worstIdx = j;
          }
        }
      }
      if (worstIdx !== -1) {
        allocation[i] = worstIdx;
        blockSizes[worstIdx] -= processSizes[i];
      } else {
        allocation[i] = -1;
      }
    }
    return allocation;
  };

  useEffect(() => {
    if (canvasRef.current && allocation.length > 0) {
      const ctx = canvasRef.current.getContext("2d");

      // Check if a chart instance already exists and destroy it
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create a new chart instance
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: allocation.map((_, index) => `Process ${index + 1}`),
          datasets: [
            {
              label: "Block No.",
              data: allocation.map((blockIndex) =>
                blockIndex === -1 ? 0 : blockIndex + 1
              ),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [allocation]);

  const renderAllocationResult = () => {
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Process No.</th>
              <th>Process Size</th>
              <th>Block No.</th>
            </tr>
          </thead>
          <tbody>
            {allocation.map((blockIndex, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{processSizes[index]}</td>
                <td>{blockIndex === -1 ? "Not Allocated" : blockIndex + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <canvas ref={canvasRef} style={{ width: "30%", height: "30%" }} />
      </div>
    );
  };

  const compareAlgorithms = () => {
    const algorithms = [firstFit, nextFit, bestFit, worstFit];
    const comparisonResult = algorithms.map((algorithmFunc) => {
      const allocationResult = algorithmFunc(
        [...blockSizes], // create a copy of blockSizes
        [...processSizes] // create a copy of processSizes
      );
      const allocated = allocationResult.filter(
        (blockIndex) => blockIndex !== -1
      ).length;
      return {
        name: algorithmFunc.name,
        allocated,
        notAllocated: processSizes.length - allocated,
      };
    });
    setComparisons(comparisonResult);
  };

  return (
    <div>
      <div onClick={allocateMemory} className="btn btn-lg btn-danger my-3">
        Allocate Memory
      </div>
      <div onClick={compareAlgorithms} className="btn btn-lg btn-primary my-3">
        Compare Algorithms
      </div>
      <div>
        <h2 className="h3 my-4">Memory Allocation Result ({algorithm}):</h2>
        {renderAllocationResult()}
        <h2 className="h3 my-4">Comparison Result:</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Allocated Processes</th>
              <th>Not Allocated Processes</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((comparison, index) => (
              <tr key={index}>
                <td>{comparison.name}</td>
                <td>{comparison.allocated}</td>
                <td>{comparison.notAllocated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MemoryAllocation;
