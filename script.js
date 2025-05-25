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
const formVacinaContainer = document.getElementById('form-vacina-container');
const listaInformadas = document.getElementById('lista-vacinas-informadas');
const addVacinaBtn = document.getElementById('add-vacina-btn');
const concluirBtn = document.getElementById('concluir-btn');
const resultadoDiv = document.getElementById('resultado');

let faseAtual = null;
const vacinasInformadas = [];

birthInput.addEventListener('change', () => {
  const data = new Date(birthInput.value);
  const hoje = new Date();
  const idadeAnos = hoje.getFullYear() - data.getFullYear() - ((hoje.getMonth() < data.getMonth() || (hoje.getMonth() === data.getMonth() && hoje.getDate() < data.getDate())) ? 1 : 0);

  if (idadeAnos <= 10) faseAtual = 'crianca';
  else if (idadeAnos <= 19) faseAtual = 'adolescente';
  else faseAtual = 'adulto';

  faseText.textContent = faseAtual;
  faseContainer.classList.remove('d-none');
  formVacinaContainer.innerHTML = '';
  listaInformadas.innerHTML = '';
  vacinasInformadas.length = 0;
  resultadoDiv.innerHTML = '';
});

function criarFormularioVacina() {
  formVacinaContainer.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'row g-3 mb-3';

  const colVac = document.createElement('div');
  colVac.className = 'col-md-6';
  const select = document.createElement('select');
  select.className = 'form-select';
  const padrao = document.createElement('option');
  padrao.text = 'Selecione a vacina'; padrao.value = '';
  select.add(padrao);
  calendario[faseAtual].forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.nome;
    opt.text = `${v.nome} (${v.doses} dose${v.doses > 1 ? 's' : ''})`;
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

  row.append(colVac, colDose, colAno);
  formVacinaContainer.appendChild(row);

  // evento de confirmação
  row.addEventListener('change', () => {
    if (select.value && doseInput.value && anoInput.value) {
      vacinasInformadas.push({
        nome: select.value,
        dose: parseInt(doseInput.value),
        ano: parseInt(anoInput.value)
      });

      const item = document.createElement('li');
      item.className = 'list-group-item';
      item.textContent = `${select.value} - ${doseInput.value}ª dose - ${anoInput.value}`;
      listaInformadas.appendChild(item);

      formVacinaContainer.innerHTML = '';
    }
  });
}

addVacinaBtn.addEventListener('click', criarFormularioVacina);

concluirBtn.addEventListener('click', () => {
  resultadoDiv.innerHTML = '';

  vacinasInformadas.forEach(({ nome, dose, ano }) => {
    const vacInfo = calendario[faseAtual].find(v => v.nome === nome);
    const alert = document.createElement('div');
    let situacao;
    if (!vacInfo) {
      situacao = '❌ Ignorada (não aplicável)';
      alert.className = 'alert alert-danger';
    } else if (dose === vacInfo.doses || vacInfo.doses === 'reforço a cada 10 anos') {
      situacao = '✅ OK';
      alert.className = 'alert alert-success';
    } else {
      situacao = '⚠️ Dose incorreta';
      alert.className = 'alert alert-warning';
    }
    alert.textContent = `${nome}: ${situacao}`;
    resultadoDiv.appendChild(alert);
  });
});
