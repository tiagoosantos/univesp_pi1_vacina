// script.js
const calendario = {
    crianca: [
      { nome: 'BCG', doses: 1, periodo: null },
      { nome: 'Hepatite B', doses: 3, periodo: { inicio: 0, fim: 1 } },
    ],
    adolescente: [
      { nome: 'HPV', doses: 2, periodo: { inicio: 9, fim: 14 } },
    ],
    adulto: [
      { nome: 'dT (difteria e tétano)', doses: 'reforço a cada 10 anos', periodo: null },
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