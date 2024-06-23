$(document).ready(function () {
  var novosJogos = [
    {
      imagens: ['assets/1.Com Erro.png', 'assets/2.Sem Erro.png'],
      coordenadas: {
        0: { x: 188, y: 522 }, // Faixa Camisa
        1: { x: 191, y: 610 }, // Faixa Calça
        2: { x: 120, y: 568 }, // Cone
        3: { x: 192, y: 430 }, // Tampa Moto Poda
        4: { x: 285, y: 437 }, // Bandeirola
        5: { x: 288, y: 514 }, // Lanterna
        6: { x: 371, y: 509 } // Faixa
      }
    },
    {
      imagens: ['assets/3.Com Erro.png', 'assets/4.Sem Erro.png'],
      coordenadas: {
        0: { x: 208, y: 477 }, // Bastão
        1: { x: 369, y: 466 }, // Faixa Refletiva
        2: { x: 520, y: 401 }, // Retrovisor
        3: { x: 585, y: 457 }, // Faixa
        4: { x: 493, y: 509 }, // Calço sapata
        5: { x: 308, y: 153 }, // Cinto de segurança
        6: { x: 455, y: 363 } // Giro Flex
      }
    },
    {
      imagens: ['assets/5.Com Erro.png', 'assets/5.Sem Erro.png'],
      coordenadas: {
        0: { x: 398, y: 103 }, // Lençol
        1: { x: 375, y: 71 }, // Faixa
        2: { x: 384, y: 559 }, // Cone
        3: { x: 312, y: 427 }, // Faixa Refletiva
        4: { x: 399, y: 403 }, // Lanterna
        5: { x: 400, y: 338 }, // Tampa Moto Poda
        6: { x: 312, y: 333 } // Bandeirola
      }
    }
  ]
  // Tamanho das imagens originais (exemplo: 800x600 pixels)
  var larguraOriginal = 800
  var alturaOriginal = 800

  var proximoJogoIndex = 0
  var jogo = new Game(novosJogos[proximoJogoIndex].coordenadas)
  var MAX_TENTATIVAS = 3 // Número máximo de tentativas permitidas
  var TEMPO_LIMITE_SEGUNDOS = 10 // Tempo limite em segundos
  var tentativas = 0 // Contador de tentativas
  var tempoRestante = TEMPO_LIMITE_SEGUNDOS // Tempo restante inicial
  var timer // ID do temporizador
  var temporizadorIniciado = false // Flag para indicar se o temporizador foi iniciado

  // Função para iniciar o próximo jogo
  window.proximoJogo = function () {
    proximoJogoIndex++
    if (proximoJogoIndex >= novosJogos.length) {
      proximoJogoIndex = 0 // Volta ao início se atingir o final da lista
    }
    var novoJogo = novosJogos[proximoJogoIndex]
    $('#imagem-esquerda')
      .attr('src', novoJogo.imagens[0])
      .css({
        width: larguraOriginal + 'px',
        height: alturaOriginal + 'px'
      })
    $('#imagem-direita')
      .attr('src', novoJogo.imagens[1])
      .css({
        width: larguraOriginal + 'px',
        height: alturaOriginal + 'px'
      })

    jogo.vars.positions = novoJogo.coordenadas

    // Reinicia o jogo
    jogo.start()
    temporizadorIniciado = false // Reseta a flag do temporizador
    tempoRestante = TEMPO_LIMITE_SEGUNDOS // Reinicia o tempo restante
    atualizarTempo() // Atualiza o display do temporizador
    // Esconde a mensagem de tempo esgotado, se estiver visível
    hideTimeUpMessage()

    // Reinicia o contador de tentativas
    tentativas = 0

    // Desabilita o botão "Próximo Jogo" até que todos os erros sejam encontrados novamente
    $('#btn-proximo-jogo').prop('disabled', true)
    // Habilita o botão de jogar novamente
    $('#btn-jogar-novamente').prop('disabled', true) // Desabilita o botão de jogar novamente
    $('#btn-iniciar').prop('disabled', false) // Habilita o botão de iniciar
    $('#btn-instrucoes').prop('disabled', false) // Habilita o botão de instruções
  }

  // Função para reiniciar o jogo
  window.restartGame = function () {
    jogo.start() // Chama o método start() do objeto jogo

    // Reseta o temporizador
    clearInterval(timer) // Limpa o temporizador atual, se existir
    temporizadorIniciado = false // Reseta a flag do temporizador
    tempoRestante = TEMPO_LIMITE_SEGUNDOS // Reinicia o tempo restante
    atualizarTempo() // Atualiza o display do temporizador

    // Esconde a mensagem de tempo esgotado, se estiver visível
    hideTimeUpMessage()
    // Esconde a mensagem de tempo esgotado, se estiver visível
  }
  // Função para esconder a mensagem de tempo esgotado
  function hideTimeUpMessage() {
    $('#time-up-message').fadeOut() // Oculta a mensagem com efeito de fade-out
  }

  // Função para iniciar o temporizador
  function iniciarTemporizador() {
    if (!temporizadorIniciado) {
      clearInterval(timer) // Limpa o temporizador anterior, se existir

      tempoRestante = TEMPO_LIMITE_SEGUNDOS
      atualizarTempo() // Atualiza o display do tempo inicial

      timer = setInterval(function () {
        tempoRestante--
        atualizarTempo()

        if (tempoRestante <= 0) {
          clearInterval(timer) // Para o temporizador quando o tempo acabar
          showTimeUpMessage() // Mostra a mensagem de tempo esgotado

          // Desabilita a adição de novos marcadores
          $canvas_main.off('click') // Remove o evento de clique da imagem

          // Desabilita outros botões
          $('#btn-jogar-novamente').prop('disabled', false) // Habilita o botão de jogar novamente
          $('#btn-iniciar').prop('disabled', true) // Desabilita o botão de iniciar
          $('#btn-instrucoes').prop('disabled', true) // Desabilita o botão de instruções
          bloquearJogo() // Bloqueia o jogo quando o tempo acaba
          // Lógica adicional de finalização do jogo aqui, se necessário
        }
      }, 1000)

      temporizadorIniciado = true // Marca o temporizador como iniciado
    }
  }

  // Função para atualizar o display do temporizador
  function atualizarTempo() {
    var minutos = Math.floor(tempoRestante / 60)
    var segundos = tempoRestante % 60
    $('#timer').text(formatTime(minutos) + ':' + formatTime(segundos))
  }

  // Função auxiliar para formatar o tempo com zero à esquerda, se necessário
  function formatTime(time) {
    return time < 10 ? '0' + time : time
  }

  // Função para mostrar a mensagem de tempo esgotado
  function showTimeUpMessage() {
    $('#time-up-message').fadeIn() // Exibe a mensagem com efeito de fade-in
  }

  // Alternar entre modo claro e escuro
  $('#toggle-mode').click(function () {
    $('body').toggleClass('dark-mode')
    if ($('body').hasClass('dark-mode')) {
      $(this).val('Modo Claro')
    } else {
      $(this).val('Modo Escuro')
    }
  })

  // Iniciar o temporizador ao clicar no botão "Iniciar"
  $('#btn-iniciar').click(function () {
    iniciarTemporizador()
  })

  // Mostrar ou esconder instruções
  $('#btn-instrucoes').click(function () {
    $('.instructions').toggle()
  })

  // Função construtora do jogo
  function Game(positions) {
    var $this = this
    $this.vars = {
      positions: positions,
      currentPositions: {},
      markers: 0,
      started: false,
      ended: false
    }
    $this.defaults = { radius: 50 }
    var $canvas_main = $('#canvas-main')
    var $canvas = $('.canvas')
    var positions = positions
    $this.init = function () {
      $this.createCanvas()
      $this.bindMouseEvents()
    }
    $this.start = function () {
      $this.vars.started = true
      $this.vars.ended = false
      $this.vars.accepts = 0
      $canvas_main.find('.marker').remove()
      $this.vars.markers = 0
      $.extend($this.vars.currentPositions, $this.vars.positions)
      $('#game-message').text('')
    }
    $this.createCanvas = function () {
      $canvas_main.on('mousemove', function (e) {
        var parentOffset = $(this).parent().offset()
        var relX = e.pageX - parentOffset.left
        var relY = e.pageY - parentOffset.top
        $('.cursor').css({
          left: relX,
          top: relY
        })
      })
      $canvas_main.on('mouseenter', function () {
        $('.cursor').addClass('visible')
      })
      $canvas_main.on('mouseleave', function () {
        $('.cursor').removeClass('visible')
      })
    }
    $this.bindMouseEvents = function () {
      $canvas_main.on('click', function (event) {
        if (!temporizadorIniciado) {
          iniciarTemporizador() // Iniciar o temporizador no primeiro clique
        }
        if ($this.vars.started && !$this.vars.ended) {
          $this.addMarker(event)
        }
      })
    }
    $this.addMarker = function (e) {
      if ($this.vars.markers < 7) {
        var parentOffset = $(e.target).parent().offset()
        var relX = e.pageX - parentOffset.left
        var relY = e.pageY - parentOffset.top
        $canvas_main.append(
          '<div class="marker" data-x="' +
            relX +
            '" data-y="' +
            relY +
            '"></div>'
        )
        $('.marker:last-child').css({
          left: relX - $this.defaults.radius / 2,
          top: relY - $this.defaults.radius / 2
        })
        $this.vars.markers++
        if ($this.vars.markers === 7) {
          $this.vars.ended = true
          $this.verify()
        }
        return true
      } else {
        return false
      }
    }

    $this.verify = function () {
      var distancia, $marker, markerPosition
      var accepts = 0

      $canvas_main.find('.marker').each(function (i) {
        $marker = $(this)
        markerPosition = { x: $marker.data('x'), y: $marker.data('y') }

        $.each($this.vars.currentPositions, function (index, position) {
          distancia = Math.sqrt(
            Math.pow(markerPosition.x - position.x, 2) +
              Math.pow(markerPosition.y - position.y, 2)
          )

          if (distancia < $this.defaults.radius) {
            $marker.addClass('accept')
            delete $this.vars.currentPositions[index]
            accepts++
            return false // Exit the $.each loop
          }
        })
      })

      if (accepts === 7) {
        $('#game-message')
          .text('Parabéns! Você detectou todos os riscos!')
          .css('color', 'green')
        clearInterval(timer) // Para o temporizador quando o jogo é ganho

        // Habilita o botão "Próximo Jogo"
        $('#btn-proximo-jogo').prop('disabled', false)
        return true
      } else {
        $('#game-message')
          .text('Tente novamente! Alguns riscos ainda não foram identificados.')
          .css('color', 'red')
        clearInterval(timer) // Para o temporizador quando o jogo é ganho

        // Desabilita o botão "Próximo Jogo" se não todos os erros foram encontrados
        $('#btn-proximo-jogo').prop('disabled', true)
        return false
      }
    }
    $this.debug = function () {
      $.each($this.vars.positions, function (index, position) {
        $canvas_main.append('<div class="target"></div>')
        $canvas_main.find('.target:last-child').css({
          left: position.x - $this.defaults.radius / 2 + 'px',
          top: position.y - $this.defaults.radius / 2 + 'px'
        })
      })
    }
    $this.init()
    $this.start()
    return $this
  }
  // Iniciar o jogo
  jogo.start()
})

// Função para iniciar o jogo ao carregar a página
window.proximoJogo() // Inicia o primeiro jogo automaticamente ao carregar a página
var btnInstrucoes = document.getElementById('btn-instrucoes')
var instructions = document.querySelector('.instructions')
btnInstrucoes.addEventListener('click', function () {
  if (instructions.style.display === 'block') {
    instructions.style.display = 'none' // Oculta as instruções se estiverem visíveis
  } else {
    instructions.style.display = 'block' // Mostra as instruções se estiverem ocultas
  }

  // Animar scroll até as instruções
  var offsetTop = instructions.offsetTop // Obtém a posição vertical das instruções
  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth' // Comportamento de rolagem suave
  })
})

// Oculta as instruções se clicar em qualquer área fora do menu de instruções
document.addEventListener('click', function (event) {
  var target = event.target
  if (!instructions.contains(target) && target !== btnInstrucoes) {
    instructions.style.display = 'none'
  }
})
