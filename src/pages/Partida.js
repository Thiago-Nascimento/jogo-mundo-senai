import {useEffect, useRef, useState} from "react";
import bananaImg from "../assets/img/banana.png";
import macaImg from "../assets/img/maca.png";
import uvasImg from "../assets/img/uvas.png";
import hamburguerImg from "../assets/img/hamburguer.png";
import batataImg from "../assets/img/batatas-fritas.png";
import pizzaImg from "../assets/img/pizza.png";
import pedraImg from "../assets/img/pedra.png";
import paredeImg from "../assets/img/parede.png";
import buracoImg from "../assets/img/buraco.png";

export const Partida = () => {
    const [darkMode, setDarkMode] = useState(false)

    const [canvas, setCanvas] = useState(null);
    const [ctx, setCtx] = useState(null)
    const animateRef = useRef();

    const [canvasInitialized, setCanvasInitialized] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [gameEnded, setGameEnded] = useState(false)

    const [score, setScore] = useState(0)
    const [healthyFoodCount, setHealthyFoodCount] = useState(0)
    const [unhealthyFoodCount, setUnhealthyFoodCount] = useState(0)
    const [level, setLevel] = useState(1)

    const [cordinatesArray, setCordinatesArray] = useState([])
    const [direction, setDirection] = useState("right");
    
    // DICA - Define a velocidade
    const [speed, setSpeed] = useState(350);

    const [rectangles, setRectangles] = useState([])
    const [snakeParticles, setSnakeParticles] = useState([])
    const [healthyFood, setHealthyFood] = useState([])
    const [unhealthyFood, setUnhealthyFood] = useState([])
    const [obstacles, setObstacles] = useState([])

    // DICA - Define as cores de fundo
    const [bgColors, setBgColors] = useState([
        'green',
        'darkgreen'
    ])

    // DICA - Define as cores da cobrinha
    const [snakeColors, setSnakeColors] = useState([
        '#0d77c5',
        '#0d99ff'
    ])

    function SnakeParticle(x, y, color, colorId) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.colorId = colorId;

        this.draw = () => {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x + 30, this.y + 30, 25, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
        }

        this.update = () => {
            this.draw();
        }
    }

    function RectangleParticles(x, y, color, colorId) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.colorId = colorId;

        this.draw = () => {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.rect(this.x, this.y, 60, 60);
            ctx.fill();
            ctx.closePath();
        }

        this.update = () => {
            this.draw();
        }
    }

    function ImageParticle(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = image;

        this.draw = () => {
            ctx.beginPath();
            ctx.drawImage(
                this.image,
                this.x, this.y,
                60, 60
            )
            ctx.closePath();
        }

        this.update = () => {
            this.draw();
        }
    }

    /* Definir valor Canvas e ctx */
    useEffect(() => {
        if (canvas === null && ctx === null) {
            const canvas = document.getElementById("canvas");
            const context = canvas.getContext('2d');
            canvas.height = 900;
            canvas.width = 1020;

            setCanvas(canvas);
            setCtx(context);
        }
    }, []);

    /* Inicializar Canvas */
    useEffect(() => {
        if ((canvas !== null && ctx !== null) || !gameStarted) {
            animateRef.current = () => {
                requestAnimationFrame(animateRef.current);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (const tempRectangle of rectangles) {
                    tempRectangle.color = bgColors[tempRectangle.colorId]
                    tempRectangle.update();
                }

                for (const tempSnakeParticle of snakeParticles) {
                    tempSnakeParticle.color = snakeColors[tempSnakeParticle.colorId]
                    tempSnakeParticle.update();
                }
            }
        }
        if (canvas !== null && ctx !== null && !canvasInitialized) {
            let tempCordinates = [];
            for (let row = 0; row < 15; row++) {
                tempCordinates[row] = [];
                for (let column = 0; column < 17; column++) {
                    tempCordinates[row][column] = {
                        x: column * 60,
                        y: row * 60
                    }
                }
            }
            setCordinatesArray(tempCordinates);

            let tempRectangles = [];
            tempCordinates.forEach((row, indexR) => {
                row.forEach((column, indexC) => {
                    let newRect = new RectangleParticles(column.x, column.y, bgColors[(Math.floor((indexC + indexR) % 2 === 1 ? 1 : 0))], (Math.floor((indexC + indexR) % 2 === 1 ? 1 : 0)))
                    tempRectangles.push(newRect)
                })
            })
            setRectangles(tempRectangles)

            let tempSnakeParticles = [];
            let mainSnakeParticle = new SnakeParticle(tempCordinates[7][2].x, tempCordinates[7][2].y, snakeColors[0], 0);
            tempSnakeParticles.push(mainSnakeParticle)
            setSnakeParticles(tempSnakeParticles);

            animateRef.current = () => {
                requestAnimationFrame(animateRef.current);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (const tempRectangle of tempRectangles) {
                    tempRectangle.color = bgColors[tempRectangle.colorId]
                    tempRectangle.update();
                }

                for (const tempSnakeParticle of tempSnakeParticles) {
                    tempSnakeParticle.color = snakeColors[tempSnakeParticle.colorId]
                    tempSnakeParticle.update();
                }
            }

            animateRef.current();
            setCanvasInitialized(true)
        }
    }, [canvas, ctx, rectangles, obstacles, snakeParticles, bgColors, snakeColors, canvasInitialized]);

    /* Iniciar Jogo // Mudar direção */
    useEffect(() => {
        if (!gameStarted) {
            const startListener = (ev) => {
                setGameStarted(true);
            }
            window.addEventListener('keydown', startListener)
            return () => window.removeEventListener('keydown', startListener)
        } else {
            const changeDirListener = (ev) => {
                // DICA - Mudar teclas de movimentação
                switch (ev.key) {
                    case "ArrowUp":
                        if (direction !== "down") {
                            setDirection("up")
                        }
                        break;
                    case "ArrowRight":
                        if (direction !== "left") {
                            setDirection("right")
                        }
                        break;
                    case "ArrowDown":
                        if (direction !== "up") {
                            setDirection("down")
                        }
                        break;
                    case "ArrowLeft":
                        if (direction !== "right") {
                            setDirection("left")
                        }
                        break;
                }
            }
            window.addEventListener('keydown', changeDirListener)
            return () => window.removeEventListener('keydown', changeDirListener)
        }
    }, [gameStarted, direction])

    const checkUniqueCords = (cordinates) => {
        if (snakeParticles.find((x) => x.x === cordinates.x && x.y === cordinates.y) || healthyFood.find((x) => x.x === cordinates.x && x.y === cordinates.y) || unhealthyFood.find((x) => x.x === cordinates.x && x.y === cordinates.y) || obstacles.find((x) => x.x === cordinates.x && x.y === cordinates.y)) {
            return false
        } else return true;
    }

    /* Animar Canvas (Pós-início) */
    useEffect(() => {
        if (gameStarted) {
            animateRef.current = () => {
                setTimeout(() => {
                    requestAnimationFrame(animateRef.current)
                }, speed)

                for (const rectangle of rectangles) {
                    rectangle.color = bgColors[rectangle.colorId]
                    rectangle.update();
                }

                for (const image of obstacles) {
                    image.update();
                }

                for (const image of healthyFood) {
                    image.update();
                }

                for (const image of unhealthyFood) {
                    image.update();
                }

                for (const snakeParticle of snakeParticles) {
                    snakeParticle.color = snakeColors[snakeParticle.colorId]
                    snakeParticle.update();
                }


                const nextParticleCordinates = {
                    x: snakeParticles[snakeParticles.length - 1].x,
                    y: snakeParticles[snakeParticles.length - 1].y
                }
                for (let i = snakeParticles.length - 1; i > 0; i--) {
                    snakeParticles[i].x = snakeParticles[i - 1].x;
                    snakeParticles[i].y = snakeParticles[i - 1].y;
                }
                const mainSnakeParticle = snakeParticles[0]
                if (!gameEnded) {

                    // DICA - Mudança de direção
                    switch (direction) {
                        case "up":
                            if (mainSnakeParticle.y - 60 >= 0 && mainSnakeParticle.y - 60 < canvas.height && !snakeParticles.find((x) => x.y === mainSnakeParticle.y - 60 && x.x === mainSnakeParticle.x)) {
                                console.log("up")
                                snakeParticles[0].y -= 60
                            } else {
                                setGameEnded(true);
                            }
                            break;
                        case "right":
                            if (mainSnakeParticle.x + 60 >= 0 && mainSnakeParticle.x + 60 < canvas.width && !snakeParticles.find((x) => x.y === mainSnakeParticle.y && x.x === mainSnakeParticle.x + 60)) {
                                console.log("right")
                                snakeParticles[0].x += 60
                            } else {
                                setGameEnded(true);
                            }
                            break;
                        case "down":
                            if (mainSnakeParticle.y + 60 >= 0 && mainSnakeParticle.y + 60 < canvas.height && !snakeParticles.find((x) => x.y === mainSnakeParticle.y + 60 && x.x === mainSnakeParticle.x)) {
                                console.log("down")
                                snakeParticles[0].y += 60
                            } else {
                                setGameEnded(true);
                            }
                            break;
                        case "left":
                            if (mainSnakeParticle.x - 60 >= 0 && mainSnakeParticle.x - 60 < canvas.width && !snakeParticles.find((x) => x.y === mainSnakeParticle.y && x.x === mainSnakeParticle.x - 60)) {
                                console.log("left")
                                snakeParticles[0].x -= 60
                            } else {
                                setGameEnded(true);
                            }
                            break;
                    }
                }

                if (healthyFood.length < level) {
                    const particlesToAdd = level - healthyFood.length;
                    for (let i = 0; i < particlesToAdd; i++) {
                        const randomCordinates = cordinatesArray[Math.floor(Math.random() * 15)][Math.floor(Math.random() * 17)];
                        const randomImage = [bananaImg, uvasImg, macaImg][Math.floor(Math.random() * 3)]
                        if (checkUniqueCords(randomCordinates)) {
                            const newFood = new ImageParticle(randomCordinates.x, randomCordinates.y, randomImage);
                            healthyFood.push(newFood)
                        } else i--
                    }
                }
                if (unhealthyFood.length < level) {
                    const particlesToAdd = level - unhealthyFood.length;
                    for (let i = 0; i < particlesToAdd; i++) {
                        const randomCordinates = cordinatesArray[Math.floor(Math.random() * 15)][Math.floor(Math.random() * 17)];
                        const randomImage = [batataImg, hamburguerImg, pizzaImg][Math.floor(Math.random() * 3)]
                        if (checkUniqueCords(randomCordinates)) {
                            const newFood = new ImageParticle(randomCordinates.x, randomCordinates.y, randomImage);
                            unhealthyFood.push(newFood)
                        } else i--
                    }
                }
                if (obstacles.length < level) {
                    const particlesToAdd = level - obstacles.length;
                    for (let i = 0; i < particlesToAdd; i++) {
                        const randomCordinates = cordinatesArray[Math.floor(Math.random() * 15)][Math.floor(Math.random() * 17)];
                        const randomImage = [buracoImg, paredeImg, pedraImg][Math.floor(Math.random() * 3)]
                        if (checkUniqueCords(randomCordinates)) {
                            const newFood = new ImageParticle(randomCordinates.x, randomCordinates.y, randomImage);
                            obstacles.push(newFood)
                        } else i--
                    }
                }

                if (healthyFood.find(x => x.x === mainSnakeParticle.x && x.y === mainSnakeParticle.y)) {
                    setScore(score + 10);
                    if (score + 10 >= 50 && level < 2) {
                        setLevel(2)
                    } else if (score + 10 >= 100 && level < 3) {
                        setLevel(3)
                    } else if (score + 10 >= 150 && level < 4) {
                        setLevel(4)
                    } else if (score + 10 >= 200 && level < 5) {
                        setLevel(5)
                    }
                    setHealthyFoodCount(healthyFoodCount + 1);

                    const newParticle = new SnakeParticle(nextParticleCordinates.x, nextParticleCordinates.y, snakeColors[(snakeParticles.length % 2 === 1 ? 1 : 0)], (snakeParticles.length % 2 === 1 ? 1 : 0))
                    snakeParticles.push(newParticle);

                    setHealthyFood(healthyFood.filter(x => !(x.x === mainSnakeParticle.x && x.y === mainSnakeParticle.y)))
                }

                if (unhealthyFood.find(x => x.x === mainSnakeParticle.x && x.y === mainSnakeParticle.y)) {
                    setScore(score - 2);
                    setUnhealthyFoodCount(unhealthyFoodCount + 1);
                    setSpeed(speed - 5)

                    setUnhealthyFood(unhealthyFood.filter(x => !(x.x === mainSnakeParticle.x && x.y === mainSnakeParticle.y)))
                }

                if (obstacles.find(x => x.x === mainSnakeParticle.x && x.y === mainSnakeParticle.y)) {
                    setScore(score - 2);

                    setObstacles(obstacles.filter(x => !(x.x === mainSnakeParticle.x && x.y === mainSnakeParticle.y)))
                }
            }
        }
    }, [canvas, ctx, bgColors, snakeColors, snakeParticles, unhealthyFood, healthyFood, obstacles, rectangles, direction, score, healthyFoodCount, unhealthyFoodCount, level, speed, gameStarted, gameEnded]);

    /* DICA - Alterar cor BG */
    useEffect(() => {
        if (darkMode) {
            setBgColors([
                'black',
                'white'
            ])
        } else {
            setBgColors([
                'green',
                'darkgreen'
            ])
        }
    }, [darkMode])

    /* DICA - Alterar cor Cobra */
    useEffect(() => {
        switch (level) {
            case 1:
                setSnakeColors([
                    '#0d77c5',
                    '#0d99ff'
                ])
                break;
            case 2:
                setSnakeColors([
                    '#ffa629',
                    '#ffcd29'
                ])
                break;
            case 3:
                setSnakeColors([
                    '#3CB2BD',
                    '#4CE2F0'
                ])
                break;
            case 4:
                setSnakeColors([
                    '#9546BD',
                    '#D8A2F2'
                ])
                break;
            case 5:
                setSnakeColors([
                    '#EEB7B7',
                    '#F4E5E5'
                ])
                break;
        }
    }, [level])

    /* End Game */
    useEffect(() => {
        if (gameEnded) {
            setTimeout((ev) => {
                window.location.reload()
            }, 2000)
        }
    }, [gameEnded]);

    return (
        <div
            className={"w-100 vh-100 d-flex align-items-center justify-content-center text-light " + (darkMode ? "bg-dark fw-bold" : "bg-success")}>
            <div className={"d-flex flex-column align-items-center gap-5 p-5 text-center w-25"}>
                <div className={"d-flex flex-column align-items-center justify-content-center gap-2"}>
                    <h3>Pontuação:</h3>
                    <span className={"fs-1"}>{score}</span>
                </div>
                <div className={"d-flex flex-column align-items-center justify-content-center gap-2"}>
                    <h3>Comidas saudáveis:</h3>
                    <span className={"fs-1"}>{healthyFoodCount}</span>
                </div>
                <div className={"d-flex flex-column align-items-center justify-content-center gap-2"}>
                    <h3>Comidas não saudáveis:</h3>
                    <span className={"fs-1"}>{unhealthyFoodCount}</span>
                </div>
                <div className={"d-flex flex-column align-items-center justify-content-center gap-2"}>
                    <h3>Nível</h3>
                    <span className={"fs-1"}>{level}</span>
                </div>
            </div>
            <div className={"w-75 h-100 d-flex position-relative align-items-center justify-content-center"}>
                <label className={"position-absolute top-0 end-0 mt-5 me-5 d-flex gap-2"}>
                    Dark Mode
                    <input type="checkbox" checked={darkMode} onChange={(ev) => {
                        setDarkMode(ev.target.checked)
                    }}/>
                </label>
                <div className={"position-relative d-flex align-items-center justify-content-center"}>
                    <div
                        className={"position-absolute top-0 start-0 bg-dark bg-opacity-50 w-100 h-100 align-items-center justify-content-center " + (!gameStarted ? "d-flex" : "d-none")}>
                        <h1>Aperte qualquer tecla para iniciar</h1>
                    </div>
                    <div
                        className={"position-absolute top-0 start-0 bg-dark bg-opacity-50 w-100 h-100 align-items-center justify-content-center " + (gameEnded ? "d-flex" : "d-none")}>
                        <h1>Você perdeu!</h1>
                    </div>
                    <canvas id={"canvas"}>
                    </canvas>
                </div>
            </div>
        </div>
    )
}

export default Partida;