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

        // 응답 디버깅
        console.log('API 응답:', data);

        if (data.answer) {
            document.getElementById("answerBox").innerText = data.answer;
            showAnswerBox();  // 답변을 성공적으로 받아오면 박스를 보여줍니다.
        } else if (data.error) {
            document.getElementById("answerBox").innerText = "오류 발생: " + data.error;
            showAnswerBox();  // 오류가 발생해도 박스를 보여줍니다.
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("answerBox").innerText = "서버 응답 오류 발생";
        showAnswerBox();  // 서버 오류 발생 시에도 박스를 보여줍니다.
    }
}

// 답변 박스를 보여주는 함수
function showAnswerBox() {
    const answerBox = document.getElementById("answerBox");
    answerBox.style.opacity = '1';  // 투명도를 1로 설정하여 표시
    answerBox.style.visibility = 'visible';  // 화면에 보이도록 변경
}
