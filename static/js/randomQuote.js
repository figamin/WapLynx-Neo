        var texts = [
  'Now 95% more comfy!',
  'Pampuru pimpuru pam pom pum!',
  'We need more quotes.'
];
            var element = document.getElementById("randomQuote");
            var isAnimating = false;
            var blinking = false;
            var interTimer;
            element.onclick = function() {
                newQuote();
                blinking = false;
                clearInterval(interTimer);
            };
            function blinkFunc()
            {
              if(blinking)
              {
                element.innerText = element.innerText.substring(0, element.innerText.length - 1);
                blinking = false;
              }
              else
              {
                element.innerText += "|";
                blinking = true;
              }
            }
            function newQuote() {
                if (isAnimating) {
                    return;
                }
                isAnimating = true;
                
                var newRando = texts[Math.floor(Math.random()*texts.length)];
                nextChar(0, newRando, "")
            }
            function nextChar(index, text, current) {
                current += text.charAt(index);
                element.innerText = '>' + current + "|";
                index++;
                if (index < text.length) {
                    //setTimeout(nextChar, 100 * Math.random(), index, text, current);
		setTimeout(nextChar, 50, index, text, current);
                } else {
                    element.innerText = element.innerText.slice(0, -1)
                    isAnimating = false;
                    interTimer = setInterval(blinkFunc, 500)
                }
            }
            newQuote();

