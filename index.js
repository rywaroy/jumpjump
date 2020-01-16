const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const Jump = {
    id: null,
    canvas: null,
    ctx: null,
    customs: [
        {
            jumpHeight: 0, // 跳跃高度
            speed: 0, // 速度
            ac: .24, // 加速度
            columns: {
                w: 20 + Math.random() * 20,
                h: 30 + Math.random() * 15,
                x: screenWidth + 800 * Math.random()
            }, // 柱子
            
            sy: 0,
        },
    ], // 关卡
    score: 0, // 得分
    total: 3, // 多少分过关
    custom: 1, // 关卡数
    customTotal: 2, // 总关卡数
    init() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = screenWidth;
        this.canvas.height = screenHeight;
        this.run();
        this.bind();
    },
    run() {
        this.id = requestAnimationFrame(this.draw.bind(this));
    },
    randomColumn() { // 随机生成柱子
        return {
          w: 20 + Math.random() * 10,
          h: 30 + Math.random() * 15
        }
    },
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawNumber();
        for (let i = 0; i < this.customs.length; i++) {
            this.drawGame(this.customs[i]);
        }
        if (this.gameOver) {
            alert('失败')
            cancelAnimationFrame(this.id);
        } else {
            if (this.veri()) {
                cancelAnimationFrame(this.id);
            } else {
                this.id = requestAnimationFrame(this.draw.bind(this));
            }
        }
        
    },
    drawGame(customs) {
        customs.ey = customs.sy + screenHeight / this.customs.length;
        customs.speed -= customs.ac;
        customs.jumpHeight += customs.speed;
        if (customs.jumpHeight < 0) {
            customs.jumpHeight = 0;
        }
        this.drawLine(customs.ey);
        this.drawMan(customs.jumpHeight, customs.ey);
        this.drawColumn(customs.columns, customs.ey);
        this.collision(customs.jumpHeight, customs.columns);
    },
    drawLine(ey) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, ey);
        this.ctx.lineTo(screenWidth, ey);
        this.ctx.stroke();
    },
    drawMan(h, ey) {
        const height = ey - h;
        this.ctx.beginPath();
        this.ctx.arc(30, height - 40, 10, 2 * Math.PI, false);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(30, height - 30);
        this.ctx.lineTo(30, height - 15);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(30, height - 30);
        this.ctx.lineTo(20, height - 15);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(30, height - 30);
        this.ctx.lineTo(40, height - 15);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(30, height - 15);
        this.ctx.lineTo(20, height);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(30, height - 15);
        this.ctx.lineTo(40, height);
        this.ctx.stroke();
    },
    drawColumn(columns, ey) {
        this.ctx.strokeRect(columns.x, ey - columns.h, columns.w, columns.h);
        // 判断柱子是否移出屏幕外，则更新柱子
        if (columns.x < -columns.w) {
            columns.w = 20 + Math.random() * 20;
            columns.h = 30 + Math.random() * 15;
            columns.x = screenWidth + 800 * Math.random();
            this.score++;
        }
        columns.x -= 4;
    },
    drawNumber() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#000';
        this.ctx.font = '18px STheiti, SimHei';
        this.ctx.fillText(`得分：${this.score}/${this.total}`, 20, 20);
        this.ctx.fillText(`关卡：${this.custom}/${this.customTotal}`, screenWidth - 100, 20);
    },
    collision(height, columns) {
        if ((columns.x <= 40 && columns.x >= -(columns.w - 20)) && (height < columns.h)) {
            this.gameOver = true;
        }
    },
    veri() { // 验证是否通关
        if (this.score >= this.total) {
            cancelAnimationFrame(this.id);
            if (this.custom === this.customTotal) {
                alert('通关');
                return true;
            }
            this.custom++;
            this.customs = [];
            this.score = 0;
            this.total = 3 + this.custom * 2;
            for (let i = 0; i < this.custom; i++) {
                this.customs.push({
                    jumpHeight: 0, // 跳跃高度
                    speed: 0, // 速度
                    ac: .24, // 加速度
                    columns: {
                        w: 20 + Math.random() * 20,
                        h: 30 + Math.random() * 15,
                        x: screenWidth + 800 * Math.random()
                    }, // 柱子
                    sy: i * screenHeight / this.custom,
                });
            }
            setTimeout(() => {
                this.run();
            }, 2000);
            return true;
        }
        return false;
    },
    bind() {
        this.canvas.addEventListener('touchstart', (e) => {
            const y = e.targetTouches[0].pageY;
            const len = this.customs.length;
            const height = screenHeight / len;
            const index = Math.floor(y / height);
            if (this.customs[index].jumpHeight < 10) {
                this.customs[index].speed = 6.4;
            }
        });
      },
}

Jump.init();