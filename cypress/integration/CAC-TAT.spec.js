
describe('Central de Atendimento ao Cliente TAT', () => {
  const threeSeconds = 3000
  beforeEach(() => {
    cy.visit('./src/index.html')

  })

  it('verifica o título de aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })
  it('preeenche os campos obrigatórios e envia o formulário', () => {
    cy.get('#firstName').type('Walmyr')
    cy.get('#lastName').type('Filho')
    cy.get('#email').type('a@a.com')
    cy.get('#open-text-area').type('teste area')
    cy.get('button[type="submit"]').click()
    cy.get('.success').should('be.visible')
  })
  it('testes o delay igual a 0', () => {
    const longText = 'test test test test test test test test test test test test test '
    cy.get('#firstName').type('Walmyr')
    cy.get('#lastName').type('Filho')
    cy.get('#email').type('a@a.com')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.get('button[type="submit"]').click()
    cy.get('.success').should('be.visible')
  })
  it('exibe mensagem de erro ao submeter o formulário com um email com formação inválida', () => {
    cy.get('#firstName').type('Walmyr')
    cy.get('#lastName').type('Filho')
    cy.get('#email').type('a@a,com') // email inválido
    cy.get('#open-text-area').type('longText teste', { delay: 0 })
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })
  // https://docs.cypress.io/faq/questions/using-cypress-faq#How-do-I-get-an-input-s-value
  it('quando digitado no campo telefone letras o campo deve permanecer vazio', () => {
    cy.get('#phone')
      .type('string')
      .should('be.empty')
      .should('have.value', '')
  })
  // https://docs.cypress.io/api/commands/check#Syntax
  it('exibe mensagem de errro quando o telefone se torna obrigatório mas não é preenchido antes de envio', () => {
    cy.get('#firstName').type('Walmyr')
    cy.get('#lastName').type('Filho')
    cy.get('#email').type('a@a.com')
    cy.get('#open-text-area').type('longText teste', { delay: 0 })
    cy.get('#phone-checkbox').check() // click no checkbox tornando true
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })
  // https://docs.cypress.io/api/commands/clear
  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Walmyr')
      .should('have.value', 'Walmyr')
      .clear()
      .should('have.value', '')
      .should('be.empty')
    cy.get('#lastName')
      .type('Filho')
      .should('have.value', 'Filho')
      .clear()
      .should('be.empty')
    cy.get('#email')
      .type('a@a.com')
      .should('have.value', 'a@a.com')
      .clear()
      .should('be.empty')
    cy.get('#phone')
      .type('112233')
      .should('have.value', '112233')
      .clear()
      .should('be.empty')
  })
  it('exibe mensagem de erro ao submeter o formulário sem prencher os campos obrigatórios', () => {
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })
  // precisa reiniciar o cypress 
  it('envia o formulário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldAndSubmit()
    cy.get('.success').should('be.visible')
  })
  // https://docs.cypress.io/api/commands/contains
  it('usando o seletor contains, aonde pega o elemento e o texto dele', () => {
    cy.get('#firstName').type('Walmyr')
    cy.get('#lastName').type('Filho')
    cy.get('#email').type('a@a.com')
    cy.get('#open-text-area').type('longText teste', { delay: 0 })
    cy.get('#phone-checkbox').check()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })
  // select
  it('seleciona um produto (Youtube) por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })
  it('seleciona um produto pelo seu valor', () => {
    cy.get('select')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })
  it('seleciona um produto pelo seu indice', () => {
    cy.get('select')
      .select(1)
      .should('have.value', 'blog')
  })
  // radio
  it('marca o tipo de atendimento "feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback')
  })
  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each((radio) => {
        cy.wrap(radio).check()
        cy.wrap(radio).should('be.checked')
      })
  })
  // checkbox
  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Walmyr')
    cy.get('#lastName').type('Filho')
    cy.get('#email').type('a@a.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('longText teste', { delay: 0 })
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })
  // upload de arquivo
  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should((input) => {
        expect(input[ 0 ].files[ 0 ].name).to.equal('example.json')
      })
  })
  it('seleciona o arquivo simulando o drag-and-drop', () => {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
      .should((input) => {
        expect(input[ 0 ].files[ 0 ].name).to.equal('example.json')
      })
  })
  it('seleciona um arquivo utilizando uma fixture para a qual foi dada alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('@sampleFile')
      .should((input) => {
        expect(input[ 0 ].files[ 0 ].name).to.equal('example.json')
      })
  })
  // links que abrem outra aba
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })
  it('acesse a página da política de privacidade removendo a target e então clica', () => {
    cy.get('#privacy a').invoke('removeAttr', 'target', 'blank').click()
  })
  it('acesse a página da política de privacidade removendo a target e então clica', () => {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target', 'blank')
      .click()
    cy.contains('CAC TAT - Política de privacidade')
      .should('be.visible')
    cy.contains('Talking About Testing')
      .should('be.visible')
  })
  it('verifica o tempo que dura a mensagem de erro', () => {
    cy.clock()
    cy.get('#firstName').type('Walmyr')
    cy.get('#lastName').type('Filho')
    cy.get('#email').type('a@a.com')
    cy.get('#open-text-area').type('teste area')
    cy.get('button[type="submit"]').click()
    cy.get('.success').should('be.visible')
    cy.tick(threeSeconds)
    cy.get('.success').should('not.be.visible')
  })
  it('verifica o tempo que dura a mensagem de erro', () => {
    cy.clock()
    cy.get('#firstName').type('Walmyr')
    cy.get('#lastName').type('Filho')
    cy.get('#email').type('a@a.com')
    cy.get('button[type="submit"]').click()
    cy.get('.error').should('be.visible')
    cy.tick(threeSeconds)
    cy.get('.error').should('not.be.visible')
  })
  it('exibe e esconde as mensagens de erro utilizando o invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso')
      .invoke('hide')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
    cy.contains('Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })
  it('preenche a área de texto usando o comando invoke', () => {
    const longText = Cypress._.repeat('123456', 20)
    cy.get('#open-text-area')
      .invoke('val', longText)
      .should('have.value', longText)
  })
  it('faz um requisição HTTP', () => {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should((response) => {
        const { status, statusText, body } = response
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).to.include('CAC TAT')
      })
  })
  it.only('encontra o gato escondido', () => {
    cy.get('#cat')
      .invoke('show')
      .should('be.visible')
    cy.get('#title')
      .invoke('text', 'CAT TAT')
    cy.get('#subtitle')
      .invoke('text', 'Eu não gosto de gatos!')
  })
})

