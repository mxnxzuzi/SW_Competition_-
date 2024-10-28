async function getAnswer() {
    const userQuestion = document.getElementById("userQuestion").value;
    const magicSound = document.getElementById("magicSound"); // 오디오 요소 가져오기

    try {
        let response = await fetch('/.netlify/functions/get_answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: userQuestion })
        });

        let data = await response.json();

        // 오디오 재생
        magicSound.play().catch(error => {
            console.error('오디오 재생 오류 발생:', error);
        });

        // 응답 디버깅
        console.log('API 응답:', data);

        if (data.answer) {
            document.getElementById("answerBox").innerText = data.answer;
            showAnswerBox();  // 답변이 있으면 박스를 보여줌
        } else if (data.error) {
            document.getElementById("answerBox").innerText = "오류 발생: " + data.error;
            showAnswerBox();  // 오류가 발생해도 박스를 보여줌
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("answerBox").innerText = "서버 응답 오류 발생";
        showAnswerBox();  // 서버 오류 시에도 박스를 보여줌
    }
}

// 답변 박스를 보여주는 함수
function showAnswerBox() {
    const answerBox = document.getElementById("answerBox");
    answerBox.style.opacity = '1';  // 투명도 1로 변경
    answerBox.style.visibility = 'visible';  // 화면에 보이도록 변경
}

document.addEventListener("DOMContentLoaded", () => {
    const magicSound = document.getElementById("magicSound");

    // 자동 재생을 시도하되, 음소거된 상태로 재생 (자동 재생 차단 우회)
    magicSound.play().catch(error => {
        console.error('자동 재생 오류:', error);
    });

    // 사용자가 페이지를 클릭할 때 음소거 해제
    document.body.addEventListener('click', () => {
        magicSound.muted = false;  // 음소거 해제
        magicSound.play().catch(error => {
            console.error('오디오 재생 오류:', error);
        });
    });
});
