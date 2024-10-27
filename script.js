async function getAnswer() {
    const userQuestion = document.getElementById("userQuestion").value;

    try {
        let response = await fetch('https://dapper-puppy-530506.netlify.app/get_answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: userQuestion })
        });

        let data = await response.json();

        // SAFETY 응답이 있을 경우 사용자에게 알림
        if (data.candidates && data.candidates[0].finishReason === 'SAFETY') {
            document.getElementById("answerBox").innerText = "안전성 문제로 답변을 제공할 수 없습니다.";
            showAnswerBox(); // 답변 박스를 보여줌
            return; 
        }

        if (data.answer) {
            document.getElementById("answerBox").innerText = data.answer;
            showAnswerBox(); // 답변 박스를 보여줌
        } else if (data.error) {
            document.getElementById("answerBox").innerText = "오류 발생: " + data.error;
            showAnswerBox(); // 오류 발생 시에도 박스를 보여줌
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("answerBox").innerText = "오류 발생: 서버 응답 오류";
        showAnswerBox(); // 서버 오류 시에도 박스를 보여줌
    }
}

// 답변 박스를 보여주는 함수
function showAnswerBox() {
    const answerBox = document.getElementById("answerBox");
    answerBox.style.opacity = '1';  // 투명도 1로 변경
    answerBox.style.visibility = 'visible';  // 화면에 보이도록 변경
}
