        var texts = [
  'Eh, whatever. If I use this Yin-Yang orb well enough, it\'ll all work out, right?',
  'Genocide is just another game. It doesn\'t matter if it\'s humans or Makai residents.',
  'I\'ll cryo-freeze you together with some English beef!',
  'The books here are worth all the donations your shrine has received over the past five years.',
  'I\'ve been in the basement. For about 495 years.',
  'Silly shrine maiden, your two-colored powers are a mere twenty-eight-point-five-seven-one-four percent as powerful as mine!',
  '90% alcohol, just like a right angle.',
  'If I was the one in charge of judging you, ripping out your tongue would be your sentence.',
  'Who said I was going to eat you? But is that delicious smell coming from you?',
  'Peaches? Hmmm, it`s nostalgic.',
  'Once again I\'ve been falsely accused of being a youkai. I don\'t mean today, ze.',
  'I can\'t keep away from my beloved, my precious. Although, if he\'s shagged her... I\'LL KILL HIM!',
  'You\'ve got... a bun in your oven???',
  'HARATAMA! KIYOTAMA!',
  'Hey Ran. It\'s a call from your \"treacherous snake\".',
  'Ran-chan shiawase!',
  'Darling! Shinobu can go to hell!',
  'WAAA! KURAI YO! SEMAI YO! KOWAI YO!!! ',
  'OTOKO NAN TE!',
  'ORE WA ONNA DA!!!!',
  'Besides, she\'s a widow, remember? She can\'t compete against a high school girl.'
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

