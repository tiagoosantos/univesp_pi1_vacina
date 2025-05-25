// script.js
const calendario = {
  crianca: [
    { nome: 'BCG', doses: 1, idade: 'ao nascer' },
    { nome: 'Hepatite B', doses: 3, idade: 'ao nascer, 1 e 6 meses' },
    { nome: 'Pentavalente', doses: 3, idade: '2, 4 e 6 meses' },
    { nome: 'Poliomielite (VIP)', doses: 3, idade: '2, 4 e 6 meses' },
    { nome: 'Rotavírus Humano', doses: 2, idade: '2 e 4 meses' },
    { nome: 'Pneumocócica 10-valente', doses: 2, idade: '2 e 4 meses' },
    { nome: 'Meningocócica C (conjugada)', doses: 2, idade: '3 e 5 meses' },
    { nome: 'Febre Amarela', doses: 1, idade: '9 meses' },
    { nome: 'Tríplice Viral (SCR)', doses: 1, idade: '12 meses' },
    { nome: 'Hepatite A', doses: 1, idade: '15 meses' },
    { nome: 'Tetra Viral (SCRV)', doses: 1, idade: '15 meses' },
    { nome: 'DTP (1º reforço)', doses: 1, idade: '15 meses' },
    { nome: 'Poliomielite (VOP) (1º reforço)', doses: 1, idade: '15 meses' },
    { nome: 'DTP (2º reforço)', doses: 1, idade: '4 anos' },
    { nome: 'Poliomielite (VOP) (2º reforço)', doses: 1, idade: '4 anos' },
    { nome: 'Varicela', doses: 1, idade: '4 anos' }
  ],
  adolescente: [
    { nome: 'HPV quadrivalente', doses: 2, idade: '9 a 14 anos' },
    { nome: 'Meningocócica ACWY', doses: 1, idade: '11 a 14 anos' },
    { nome: 'Hepatite B', doses: 3, idade: 'a qualquer tempo' },
    { nome: 'Difteria e Tétano (dT)', doses: 3, idade: 'a qualquer tempo' },
    { nome: 'Tríplice Viral (SCR)', doses: 2, idade: 'a qualquer tempo' },
    { nome: 'Febre Amarela', doses: 1, idade: 'a qualquer tempo' }
  ],
  adulto: [
    { nome: 'Hepatite B', doses: 3, idade: 'a qualquer tempo' },
    { nome: 'Difteria e Tétano (dT)', doses: 3, idade: 'a qualquer tempo' },
    { nome: 'Febre Amarela', doses: 1, idade: 'a qualquer tempo' },
    { nome: 'Tríplice Viral (SCR)', doses: 2, idade: 'até 29 anos' },
    { nome: 'Tríplice Viral (SCR)', doses: 1, idade: '30 a 59 anos' }
  ]
};

  
  const birthInput = document.getElementById('birthdate');
  const faseContainer = document.getElementById('fase-container');
  const faseText = document.getElementById('fase-text');
  const vacinasContainer = document.getElementById('vacinas-container');
  const addVacinaBtn = document.getElementById('add-vacina-btn');
  const concluirBtn = document.getElementById('concluir-btn');
  const resultadoDiv = document.getElementById('resultado');
  
  let faseAtual = null;
  
  birthInput.addEventListener('change', () => {
    const data = new Date(birthInput.value);
    const hoje = new Date();
    const idadeAnos = hoje.getFullYear() - data.getFullYear() - ((hoje.getMonth() < data.getMonth() || (hoje.getMonth() === data.getMonth() && hoje.getDate() < data.getDate())) ? 1 : 0);
  
    if (idadeAnos <= 10) faseAtual = 'crianca';
    else if (idadeAnos <= 19) faseAtual = 'adolescente';
    else faseAtual = 'adulto';
  
    faseText.textContent = faseAtual;
    faseContainer.classList.remove('d-none');
    vacinasContainer.innerHTML = '';
    resultadoDiv.innerHTML = '';
  });
  
  function criarVacinaItem() {
    const row = document.createElement('div');
    row.className = 'row g-3 mb-3';
  
    const colVac = document.createElement('div');
    colVac.className = 'col-md-5';
    const select = document.createElement('select');
    select.className = 'form-select';
    const padrao = document.createElement('option');
    padrao.text = 'Selecione a vacina'; padrao.value = '';
    select.add(padrao);
    calendario[faseAtual].forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.nome;
      opt.text = `${v.nome} (${v.doses} dose(s))`;
      select.add(opt);
    });
    colVac.appendChild(select);
  
    const colDose = document.createElement('div');
    colDose.className = 'col-md-3';
    const doseInput = document.createElement('input');
    doseInput.type = 'number';
    doseInput.min = 1;
    doseInput.placeholder = 'Dose';
    doseInput.className = 'form-control';
    colDose.appendChild(doseInput);
  
    const colAno = document.createElement('div');
    colAno.className = 'col-md-3';
    const anoInput = document.createElement('input');
    anoInput.type = 'number';
    anoInput.min = 1900;
    anoInput.max = new Date().getFullYear();
    anoInput.placeholder = 'Ano';
    anoInput.className = 'form-control';
    colAno.appendChild(anoInput);
  
    const colRem = document.createElement('div');
    colRem.className = 'col-md-1 d-flex align-items-center';
    const remBtn = document.createElement('button');
    remBtn.type = 'button';
    remBtn.className = 'btn btn-outline-danger btn-sm';
    remBtn.textContent = '✕';
    remBtn.addEventListener('click', () => row.remove());
    colRem.appendChild(remBtn);
  
    row.append(colVac, colDose, colAno, colRem);
    return row;
  }
  
  addVacinaBtn.addEventListener('click', () => {
    vacinasContainer.appendChild(criarVacinaItem());
  });
  
  concluirBtn.addEventListener('click', () => {
    resultadoDiv.innerHTML = '';
    const items = vacinasContainer.querySelectorAll('.row');
    const relatorio = [];
  
    items.forEach(el => {
      const nome = el.querySelector('select').value;
      const dose = parseInt(el.querySelector('input[type=number]').value);
      const ano = parseInt(el.querySelectorAll('input[type=number]')[1].value);
      if (!nome) return;
  
      const vacInfo = calendario[faseAtual].find(v => v.nome === nome);
      const status = { nome, dose, ano, situacao: '' };
  
      if (!vacInfo) {
        status.situacao = '❌ Ignorada (não aplicável)';
      } else if (vacInfo.doses === 'reforço a cada 10 anos' || dose === vacInfo.doses) {
        status.situacao = '✅ OK';
      } else {
        status.situacao = '⚠️ Dose incorreta';
      }
  
      relatorio.push(status);
    });
  
    relatorio.forEach(r => {
      const alert = document.createElement('div');
      let cls = 'alert ';
      if (r.situacao.startsWith('✅')) cls += 'alert-success';
      else if (r.situacao.startsWith('⚠️')) cls += 'alert-warning';
      else cls += 'alert-danger';
      alert.className = cls;
      alert.textContent = `${r.nome}: ${r.situacao}`;
      resultadoDiv.appendChild(alert);
    });
  });