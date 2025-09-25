document.addEventListener('DOMContentLoaded', function(){
	const btn = document.getElementById('cta') || document.getElementById('no-btn');
	const card = document.querySelector('.card');
			// obtener o crear elemento audio para reproducir la pista local
			let audio = document.getElementById('bg-audio');
			if(!audio){
				audio = document.createElement('audio');
				audio.id = 'bg-audio';
				audio.src = 'music.mp3';
				audio.preload = 'auto';
				document.body.appendChild(audio);
			}

	if(!btn || !card) return; // nada que hacer si falta el botón o la tarjeta

	btn.addEventListener('click', function(){
			// Si es el botón principal, intentamos arrancar la música y redirigir
			if(btn.id === 'cta'){
						try{
							if(audio){
								audio.loop = true;
								audio.volume = 0.0; // empezamos en silencio para intentar fade-in
								const p = audio.play();
								if(p && p.then){
									p.then(()=>{
										// fade-in simple
										let v = 0.0;
										const t = setInterval(()=>{ v += 0.06; if(v>=0.9){ audio.volume = 0.9; clearInterval(t);} else audio.volume = v; }, 80);
									}).catch(()=>{
										// reproducción bloqueada: creamos un pequeño botón play para que el usuario lo habilite
										ensurePlayButton();
									});
								}
							}
						}catch(e){/* ignore */}
				// marcar en sessionStorage que la música fue solicitada (para la segunda página)
				try{ sessionStorage.setItem('play-music','1'); }catch(e){}
				window.location.href = 'secondpage.html';
				return;
			}

				// si es el botón 'No' (segunda página), ocultamos el botón y mostramos el mensaje
				const reveal = document.getElementById('reveal');
				if(reveal){
					// ocultar el botón
					btn.style.display = 'none';
					// reproducir algunos corazones y mostrar el mensaje
					for(let i=0;i<10;i++) createHeart(card);
					// pequeña pausa para que las partículas aparezcan y luego mostramos el mensaje
					setTimeout(()=>{
						reveal.classList.add('show');
						reveal.setAttribute('aria-hidden','false');
					}, 200);
					return;
				}
	});

	function createHeart(root){
		const el = document.createElement('div');
		el.className = 'float-heart';
		el.textContent = '💜';
		const sz = 14 + Math.random()*18;
		el.style.fontSize = sz + 'px';
		el.style.left = (20 + Math.random()*60) + '%';
		el.style.top = (25 + Math.random()*50) + '%';
		root.appendChild(el);
		setTimeout(()=> el.classList.add('pop'), 20);
		setTimeout(()=> el.remove(), 1400);
	}
		// Al cargar la página, si en sessionStorage hay una marca para reproducir música, lo intentamos
			try{
				if(sessionStorage.getItem('play-music') === '1'){
					if(audio){
						audio.loop = true;
						audio.volume = 0.0;
						const p2 = audio.play();
						if(p2 && p2.then){
							p2.then(()=>{
								let v = 0.0;
								const t2 = setInterval(()=>{ v += 0.06; if(v>=0.9){ audio.volume = 0.9; clearInterval(t2);} else audio.volume = v; }, 80);
							}).catch(()=>{ ensurePlayButton(); });
						}
					}
				}
			}catch(e){}

			function ensurePlayButton(){
				if(document.getElementById('audio-play')) return;
				const b = document.createElement('button');
				b.id = 'audio-play';
				b.textContent = 'Play música';
				b.style.position = 'fixed';
				b.style.right = '18px';
				b.style.bottom = '18px';
				b.style.padding = '10px 14px';
				b.style.borderRadius = '999px';
				b.style.border = 'none';
				b.style.background = 'linear-gradient(90deg,#ff6ec7,#5ea8ff)';
				b.style.color = 'white';
				b.style.zIndex = 9999;
				b.addEventListener('click', ()=>{
					if(audio){ audio.play().catch(()=>{}); }
					b.remove();
				});
				document.body.appendChild(b);
			}
});
