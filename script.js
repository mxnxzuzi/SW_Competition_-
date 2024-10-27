async function getAnswer() {
    const userQuestion = document.getElementById("userQuestion").value;

    try {
        let response = await fetch('/.netlify/functions/get_answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: userQuestion })
        });

        let data = await response.json();

        if (data.answer) {
            document.getElementById("answerBox").innerText = data.answer;
        } else if (data.error) {
            document.getElementById("answerBox").innerText = "오류 발생: " + data.error;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("answerBox").innerText = "서버 응답 오류 발생";
    }
}

// 답변 박스를 보여주는 함수
function showAnswerBox() {
    const answerBox = document.getElementById("answerBox");
    answerBox.style.opacity = '1';  // 투명도 1로 변경
    answerBox.style.visibility = 'visible';  // 화면에 보이도록 변경
}
