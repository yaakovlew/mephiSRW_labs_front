import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskBar from "./Lab1ATaskBar.tsx";
import MatrixDisplay from "./MatrixDisplay.tsx";
import Lab1AMatrixTaskStep from "./Lab1AMatrixTaskStep.tsx";
import Lab1AResult from "./Lab1AResult.tsx"
import Lab1AResultsTable from "./Lab1ADisplayResult.tsx"
import Timer from "./Timer.tsx"

type Lab1AVariance = {
  matrices: number[][][];
};

type GeneratedLab1AVariance = {
  number: number;
  variance: Lab1AVariance;
};

type Lab1AVariant = {
  user_id: number;
  variant: GeneratedLab1AVariance;
};

const Lab1aVariance: React.FC = () => {
  const [data, setData] = useState<Lab1AVariant | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);


  const steps = ["Задание", "Шаг 1", "Шаг 2", "Шаг 3", "Шаг 4", "Шаг 5", "Шаг 6", "Результат"];

	let currStepString = localStorage.getItem("step");
	let currStep = currStepString ? parseInt(currStepString, 10) : 1;
	if (currStep === 1) {
		localStorage.setItem("step", "1")
	}

  const result = steps.slice(0, currStep+1);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let token = localStorage.getItem("token");
      let labToken = localStorage.getItem("lab-token");

      const response = await axios.get<Lab1AVariant>("http://localhost:8001/lab1a/variant", {
        headers: {
          Authorization: `Bearer ${token}`,
          "lab-token": labToken,
        },
        params: {
          laboratory_id: 1,
        },
      });

      setData(response.data);
      localStorage.setItem("task", JSON.stringify(response.data));
    } catch (err: any) {
      setError(err.message || "Ошибка при выполнении запроса");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const localData = localStorage.getItem("task");
    if (localData) {
      try {
        const parsedData = JSON.parse(localData) as Lab1AVariant;
        setData(parsedData);
      } catch (err) {
        localStorage.removeItem("task");
        fetchData();
      }
    } else {
      fetchData();
    }
  }, []);

	const renderStepContent = () => {
    switch (activeStep) {
        case 0:
            return (
                <div>
                    <h3>Цель: выбор ЦБ для портфеля.</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '45%' }}>
                            <h4>Критерии:</h4>
                            <ul>
                                <li>Доходность (Д)</li>
                                <li>Риск (Р)</li>
                                <li>Стоимость акций (С)</li>
                                <li>Ликвидность (Л)</li>
                            </ul>
                        </div>
                        <div style={{ width: '45%' }}>
                            <h4>Альтернативы:</h4>
                            <ul>
                                <li>Акция А</li>
                                <li>Акция B</li>
                                <li>Акция C</li>
                            </ul>
                        </div>
                    </div>
                    {/* Контейнер для матриц с блоковым отображением */}
                    <div style={{ marginTop: '20px' }}>
                        {data.variant.variance.matrices.map((matrix, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <MatrixDisplay key={index} matrix={matrix} index={index + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 1:
            return (
                <Lab1AMatrixTaskStep
                    matrix={data.variant.variance.matrices[0]} 
                    step={1}
                />
            );
        case 2:
            return (
                <Lab1AMatrixTaskStep
                    matrix={data.variant.variance.matrices[1]} 
                    step={2}
                />
            );
        case 3:
            return (
                <Lab1AMatrixTaskStep
                    matrix={data.variant.variance.matrices[2]} 
                    step={3}
                />
            );
        case 4:
            return (
                <Lab1AMatrixTaskStep
                    matrix={data.variant.variance.matrices[3]} 
                    step={4}
                />
            );
        case 5:
            return (
                <Lab1AMatrixTaskStep
                    matrix={data.variant.variance.matrices[4]} 
                    step={5}
                />
            );
        case 6:
            return (
                <Lab1AResult/>
            );
        case 7:
            return (<Lab1AResultsTable/>);
    }
};

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Лабораторная работ №1А "Одноуровневые иерархии"</h1>
			{<Timer/>}
      {data ? (
        <div>
          <TaskBar activeStep={activeStep} steps={result} onStepChange={setActiveStep} />
          {renderStepContent()}
        </div>
      ) : (
        <div style={styles.noData}>Нет данных для отображения.</div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    color: "#333",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "20px",
  },
  matricesContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  matrixBlock: {
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "15px",
    textAlign: "center",
  },
  matrixTitle: {
    marginBottom: "10px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  cell: {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "center",
    minWidth: "50px",
    maxWidth: "50px",
    height: "50px",
  },
  noData: {
    textAlign: "center",
    fontSize: "16px",
    color: "#777",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#555",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    color: "#d9534f",
  },
};

export default Lab1aVariance;