document.addEventListener('DOMContentLoaded', () => {
    let jsonData;

    function pct_point(a, b) {
        let c = (a / b * 100).toFixed(2);
        return `Total Point: ${a} / ${b} (${c}%)`;
    }

    const main = document.querySelector('#main');
    const dataSelection = document.querySelector('#data-selection');
    const data1Button = document.querySelector('#data1-btn');
    const data2Button = document.querySelector('#data2-btn');
    const data3Button = document.querySelector('#data3-btn');

    // Function to load JSON data and initialize quiz
    function loadDataAndStartQuiz(dataFile) {
        fetch(dataFile)
            .then(res => res.json())
            .then(data => {
                jsonData = shuffleArray(data);
                dataSelection.style.display = 'none';  // Hide data selection screen
                main.removeAttribute('hidden');  // Show quiz content
                initializeQuiz();
            })
            .catch(error => 
                console.error('Error loading JSON file:', error)
            );
    }

    // Event listeners for data selection
    data1Button.addEventListener('click', () => loadDataAndStartQuiz('./data/data1.json'));
    data2Button.addEventListener('click', () => loadDataAndStartQuiz('./data/data2.json'));
    data3Button.addEventListener('click', () => loadDataAndStartQuiz('./data/data_ht.json'));

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function initializeQuiz() {
        let currentQuestionIndex = 0;
        let totalPoint = 0;
        let submitted = false;

        const resultPoint = document.querySelector('#result');
        const nextButton = document.querySelector('#next');
        const submitButton = document.querySelector('#submit');

        resultPoint.innerText = pct_point(totalPoint, jsonData.length);

        updateQuestion();

        function updateQuestion() {
            const currentData = jsonData[currentQuestionIndex];

            const optionList = currentData.option.map((value, index) => {
                return `<li value='${index + 1}'>${value}</li>`;
            }).join('');

            const heading = document.querySelector('#question');
            heading.innerText = `Câu ${currentQuestionIndex + 1}. ${currentData.question}`;

            const ul = document.querySelector('ul');
            ul.innerHTML = optionList;

            const liElements = document.querySelectorAll('li');

            liElements.forEach(li => {
                li.addEventListener('click', () => {
                    if (!submitted) {
                        liElements.forEach(otherLi => {
                            otherLi.classList.remove('selected');
                        });
                        li.classList.add('selected');
                    }
                });
            });

            submitButton.disabled = false;
            nextButton.disabled = true;
            submitted = false;
        }

        submitButton.addEventListener('click', () => {
            const checkedLi = document.querySelector('.selected');
            if (checkedLi && !submitted) {
                if (checkedLi.value == jsonData[currentQuestionIndex].answer) {
                    checkedLi.classList.add('right');
                    totalPoint++;
                } else {
                    checkedLi.classList.add('wrong');
                    const correctLi = document.querySelector(`li[value='${jsonData[currentQuestionIndex].answer}']`);
                    correctLi.classList.add('right');
                }

                resultPoint.innerText = pct_point(totalPoint, jsonData.length);
                submitButton.disabled = true;
                nextButton.disabled = false;
                submitted = true;
            }
        });

        nextButton.addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < jsonData.length) {
                updateQuestion();
            } else {
                let pct_point = (totalPoint / jsonData.length * 100).toFixed(2);
                let message = `Your point: ${pct_point}%. Do you want to reload the page?`;
                confirm(message) ? location.reload() : null;
            }
        });
    }
});
