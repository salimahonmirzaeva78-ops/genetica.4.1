document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark / Light Theme boshqaruvi
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    });

    // Mobil menyu
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // 2. DNK Qo'sh Spirali Animatsiyasi (HTML5 Canvas)
    const canvas = document.getElementById('dnaCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let angle = 0;

        function drawDNA() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const totalPairs = 14;
            const spacingY = 20;
            const startY = 25;
            const amplitude = 85;

            for (let i = 0; i < totalPairs; i++) {
                const y = startY + i * spacingY;
                const phase = angle + i * 0.45;
                const x1 = centerX + Math.sin(phase) * amplitude;
                const x2 = centerX - Math.sin(phase) * amplitude;
                const z1 = Math.cos(phase);

                // Asoslar orasidagi vodorod bog'lari
                ctx.beginPath();
                ctx.moveTo(x1, y);
                ctx.lineTo(x2, y);
                ctx.strokeStyle = i % 2 === 0 ? 'rgba(14, 165, 233, 0.45)' : 'rgba(16, 185, 129, 0.45)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Birinchi zanjir nukleotidi
                ctx.beginPath();
                ctx.arc(x1, y, z1 > 0 ? 7 : 5, 0, Math.PI * 2);
                ctx.fillStyle = '#0ea5e9';
                ctx.fill();

                // Ikkinchi zanjir nukleotidi
                ctx.beginPath();
                ctx.arc(x2, y, z1 < 0 ? 7 : 5, 0, Math.PI * 2);
                ctx.fillStyle = '#10b981';
                ctx.fill();
            }

            angle += 0.03;
            requestAnimationFrame(drawDNA);
        }
        drawDNA();
    }

    // 3. Mendel Qonunlari Tablari
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // 4. Pennet Katagi Simulyatori
    const crossTypeSelect = document.getElementById('crossType');
    const parent1Select = document.getElementById('parent1');
    const parent2Select = document.getElementById('parent2');
    const calculateBtn = document.getElementById('calculateBtn');
    const punnettGrid = document.getElementById('punnettGrid');
    const genotypeStats = document.getElementById('genotypeStats');
    const phenotypeStats = document.getElementById('phenotypeStats');

    const monoOptions = ['AA', 'Aa', 'aa'];
    const diOptions = ['AABB', 'AABb', 'AaBB', 'AaBb', 'AAbb', 'Aabb', 'aaBB', 'aaBb', 'aabb'];

    function populateParents() {
        const type = crossTypeSelect.value;
        const opts = type === 'mono' ? monoOptions : diOptions;
        parent1Select.innerHTML = '';
        parent2Select.innerHTML = '';

        opts.forEach(g => {
            parent1Select.innerHTML += `<option value="${g}">${g}</option>`;
            parent2Select.innerHTML += `<option value="${g}">${g}</option>`;
        });

        // Standart geterozigota qiymatlarni tanlab qo'yish
        if (type === 'mono') {
            parent1Select.value = 'Aa';
            parent2Select.value = 'Aa';
        } else {
            parent1Select.value = 'AaBb';
            parent2Select.value = 'AaBb';
        }
        runSimulation();
    }

    function getGametes(genotype) {
        if (genotype.length === 2) {
            return [genotype[0], genotype[1]];
        } else {
            const aAlleles = [genotype[0], genotype[1]];
            const bAlleles = [genotype[2], genotype[3]];
            const gametes = [];
            for (let a of aAlleles) {
                for (let b of bAlleles) {
                    gametes.push(a + b);
                }
            }
            return gametes;
        }
    }

    function combineGametes(g1, g2) {
        if (g1.length === 1) {
            return [g1, g2].sort().join('');
        } else {
            const pairA = [g1[0], g2[0]].sort().join('');
            const pairB = [g1[1], g2[1]].sort().join('');
            return pairA + pairB;
        }
    }

    function getPhenotype(genotype) {
        const color = genotype.includes('A') ? 'Sariq' : 'Yashil';
        if (genotype.length === 2) {
            return color;
        }
        const shape = genotype.includes('B') ? 'silliq' : 'burishgan';
        return `${color}, ${shape}`;
    }

    function runSimulation() {
        const p1 = parent1Select.value;
        const p2 = parent2Select.value;
        const g1List = getGametes(p1);
        const g2List = getGametes(p2);

        const genotypeCounts = {};
        const phenotypeCounts = {};
        const total = g1List.length * g2List.length;

        let tableHTML = `<table class="punnett-table"><thead><tr><th>♀ \\ ♂</th>`;
        g2List.forEach(g2 => {
            tableHTML += `<th>${g2}</th>`;
        });
        tableHTML += `</tr></thead><tbody>`;

        g1List.forEach(g1 => {
            tableHTML += `<tr><th>${g1}</th>`;
            g2List.forEach(g2 => {
                const childGenotype = combineGametes(g1, g2);
                const childPhenotype = getPhenotype(childGenotype);

                genotypeCounts[childGenotype] = (genotypeCounts[childGenotype] || 0) + 1;
                phenotypeCounts[childPhenotype] = (phenotypeCounts[childPhenotype] || 0) + 1;

                tableHTML += `<td><strong>${childGenotype}</strong><span>${childPhenotype}</span></td>`;
            });
            tableHTML += `</tr>`;
        });
        tableHTML += `</tbody></table>`;
        punnettGrid.innerHTML = tableHTML;

        // Genotip statistikasi
        genotypeStats.innerHTML = '';
        Object.entries(genotypeCounts).forEach(([geno, count]) => {
            const percent = ((count / total) * 100).toFixed(1);
            genotypeStats.innerHTML += `<li><code>${geno}</code> <span><strong>${count}/${total}</strong> (${percent}%)</span></li>`;
        });

        // Fenotip statistikasi
        phenotypeStats.innerHTML = '';
        Object.entries(phenotypeCounts).forEach(([pheno, count]) => {
            const percent = ((count / total) * 100).toFixed(1);
            phenotypeStats.innerHTML += `<li><span>${pheno}</span> <span><strong>${count}/${total}</strong> (${percent}%)</span></li>`;
        });
    }

    crossTypeSelect.addEventListener('change', populateParents);
    calculateBtn.addEventListener('click', runSimulation);
    populateParents();

    // 5. Akademik Test Tizimi
    const quizData = [
        {
            question: "1. Monoduragay chatishtirishda ikkita geterozigota (Aa × Aa) organizm chatishtirilganda F₂ avlodda fenotipik ajralish nisbati qanday bo‘ladi?",
            options: ["1 : 2 : 1", "3 : 1", "9 : 3 : 3 : 1", "1 : 1"],
            correct: 1,
            explanation: "Mendelning ikkinchi qonuniga ko‘ra, Aa × Aa chatishtirilganda 3 qism dominant (AA, Aa) va 1 qism retsessiv (aa) fenotip hosil bo‘ladi (3 : 1)."
        },
        {
            question: "2. Mendelning uchinchi qonuni (belgilarning mustaqil taqsimlanishi) qaysi holda to‘liq amal qiladi?",
            options: [
                "Genlar bitta xromosomada yonma-yon joylashgan bo‘lsa",
                "Genlar no-gomologik (har xil juft) xromosomalarda joylashgan bo‘lsa",
                "Faqat chala dominantlik kuzatilganda",
                "Organizm gomozigota bo‘lsa"
            ],
            correct: 1,
            explanation: "Belgilar mustaqil taqsimlanishi uchun ularni belgilovchi genlar har xil juft (no-gomologik) xromosomalarda joylashgan bo‘lishi shart."
        },
        {
            question: "3. Tomas Morgan qonuniga ko‘ra, bitta xromosomada joylashgan barcha genlar nima deb ataladi?",
            options: ["Allel genlar", "Birikish guruhi", "Polimer genlar", "Komplementar genlar"],
            correct: 1,
            explanation: "Bitta xromosomada joylashgan va odatda birgalikda irsiylanadigan genlar majmuasi birikish guruhini tashkil etadi."
        },
        {
            question: "4. Genlar orasidagi masofani o‘lchash birligi nima va u nimaga asoslanadi?",
            options: [
                "Nanometr — DNK uzunligiga",
                "Morganida — krossingover foiziga",
                "Dalton — oqsil massasiga",
                "Angstrem — xromosoma eniga"
            ],
            correct: 1,
            explanation: "1% krossingover 1 morganidaga teng. Krossingover foizi genlar orasidagi masofaga to‘g‘ri proporsionaldir."
        },
        {
            question: "5. AaBb genotipli digeterozigota organizm normal meyoz jarayonida necha xil gameta hosil qiladi?",
            options: ["2 xil", "4 xil", "8 xil", "16 xil"],
            correct: 1,
            explanation: "2ⁿ formulaga ko‘ra (n = geterozigota juftlar soni = 2), 2² = 4 xil gameta (AB, Ab, aB, ab) hosil bo‘ladi."
        },
        {
            question: "6. Chala dominantlikda (masalan, namozshomgul o‘simligida) F₂ avlodda fenotip va genotip nisbati qanday bo‘ladi?",
            options: [
                "Fenotip 3:1, genotip 1:2:1",
                "Ikkalasi ham 1 : 2 : 1",
                "Fenotip 9:3:3:1",
                "Ikkalasi ham 3 : 1"
            ],
            correct: 1,
            explanation: "Chala dominantlikda geterozigota (Aa) oraliq belgi (pushti rang) bergani sababli fenotip va genotip nisbati bir xil — 1 : 2 : 1 bo‘ladi."
        }
    ];

    let currentQ = 0;
    let score = 0;

    const questionCounter = document.getElementById('questionCounter');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const quizProgress = document.getElementById('quizProgress');
    const questionText = document.getElementById('questionText');
    const optionsList = document.getElementById('optionsList');
    const explanationBox = document.getElementById('explanationBox');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const quizContent = document.getElementById('quizContent');
    const quizResult = document.getElementById('quizResult');
    const finalScoreText = document.getElementById('finalScoreText');
    const restartQuizBtn = document.getElementById('restartQuizBtn');

    function loadQuestion() {
        const q = quizData[currentQ];
        questionCounter.textContent = `Savol ${currentQ + 1} / ${quizData.length}`;
        quizProgress.style.width = `${((currentQ + 1) / quizData.length) * 100}%`;
        questionText.textContent = q.question;
        optionsList.innerHTML = '';
        explanationBox.classList.add('hidden');
        nextQuestionBtn.classList.add('hidden');

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectOption(idx, btn));
            optionsList.appendChild(btn);
        });
    }

    function selectOption(selectedIdx, selectedBtn) {
        const q = quizData[currentQ];
        const allBtns = optionsList.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.disabled = true);

        if (selectedIdx === q.correct) {
            selectedBtn.classList.add('correct');
            score++;
            scoreDisplay.textContent = `Ball: ${score}`;
        } else {
            selectedBtn.classList.add('wrong');
            allBtns[q.correct].classList.add('correct');
        }

        explanationBox.innerHTML = `<strong>Ilmiy izoh:</strong> ${q.explanation}`;
        explanationBox.classList.remove('hidden');
        nextQuestionBtn.classList.remove('hidden');
    }

    nextQuestionBtn.addEventListener('click', () => {
        currentQ++;
        if (currentQ < quizData.length) {
            loadQuestion();
        } else {
            quizContent.classList.add('hidden');
            quizResult.classList.remove('hidden');
            finalScoreText.textContent = `Siz ${quizData.length} ta savoldan ${score} tasiga to‘g‘ri javob berdingiz (${Math.round((score / quizData.length) * 100)}%).`;
        }
    });

    restartQuizBtn.addEventListener('click', () => {
        currentQ = 0;
        score = 0;
        scoreDisplay.textContent = 'Ball: 0';
        quizResult.classList.add('hidden');
        quizContent.classList.remove('hidden');
        loadQuestion();
    });

    loadQuestion();
});