import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//PUBLIC CONTENT
import { HomeComponent } from './home/home.component';
import { AboutWorbbyComponent } from './about-worbby/about-worbby.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { HowDoesItWorkComponent } from './how-does-it-work/how-does-it-work.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { SupportComponent } from './support/support.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { EndorsementsComponent } from './endorsements/endorsements.component';
import { FindTalentComponent } from './find-talent/find-talent.component';
import { PageWorbbiorComponent } from '@app/worbbior/page/page-worbbior.component';
import { BecomeWorbbiorComponent } from './become-a-worbbior/become-a-worbbior.component';
import { HowDoesItWorkWorbbiorComponent } from './how-does-it-work-worbbior/how-does-it-work-worbbior.component';
import { FindTasksComponent } from './find-tasks/find-tasks.component';
import { PostTaskComponent } from './post-a-task/post-a-task.component';
import { EndorsementSelectActivityComponent } from './endorsements/endorsement-select-activity.component';
import { MetaModule } from '@nglibs/meta';
import { EndorsementSuccessComponent } from './endorsements/endorsement-success.component';
import { WorbbyTaskComponent } from './worbby-task/worbby-task.component';
import { ActivityCenterComponent } from "./activity-center/activity-center-page.component";
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { PublicComponent } from './public.component';


@NgModule({
  imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PublicComponent,
                children: [
                    {
                      path: 'endorsement', component: EndorsementsComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                    {
                      path: 'endosso', component: EndorsementsComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                    {
                      path: 'endosso-sucesso', component: EndorsementSuccessComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }

                    },
                    { path: 'endorsement-success', redirectTo: 'endosso/sucesso', pathMatch: 'full' },
                    { path: 'suggest-activities', redirectTo: 'sugerir-atividades', pathMatch: 'full' },
                    {
                      path: 'sugerir-atividades', component: EndorsementSelectActivityComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                    {
                      path: '', component: HomeComponent, data: {
                        meta: {
                          title: 'WORBBY conecta você com talentos para facilitar a sua vida',
                          description: 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:title': 'WORBBY conecta você com talentos para facilitar a sua vida',
                          'og:description': 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:url': 'http://www.worbby.com/home',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    {
                      path: 'centro-interesse/:interestCenterId', component: ActivityCenterComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                    {
                      path: 'sobre', component: AboutWorbbyComponent, data: {
                        meta: {
                          title: 'O que é Worbby? | WORBBY = WORK + HOBBY',
                          description: 'Worbby é uma comunidade de pessoas talentosas e apaixonadas pelo que fazem e que podem te ajudar nas tarefas do dia a dia.',
                          'og:title': 'O que é Worbby? | WORBBY = WORK + HOBBY',
                          'og:description': 'Worbby é uma comunidade de pessoas talentosas e apaixonadas pelo que fazem e que podem te ajudar nas tarefas do dia a dia.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'about-worbby', redirectTo: 'sobre', pathMatch: 'full' },

                    {
                      path: 'fale-com-o-Worbby', component: ContactComponent, data: {
                        meta: {
                          title: 'CONTATO - Fale com a gente | WORBBY = WORK + HOBBY',
                          description: 'Entre em contato com a equipe da Worbby. Envie mensagem, elogio, dúvida ou reclamação .',
                          'og:title': 'CONTATO - Fale com a gente | WORBBY = WORK + HOBBY',
                          'og:description': 'Entre em contato com a equipe da Worbby. Envie mensagem, elogio, dúvida ou reclamação .',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'contact', redirectTo: 'fale-com-o-Worbby', pathMatch: 'full' },

                    {
                      path: 'perguntas-frequentes', component: FaqComponent, data: {
                        meta: {
                          title: 'Perguntas frequentes |WORBBY = WORK + HOBBY',
                          description: 'Tem dúvidas sobre o funcionamento da WORBBY? Perguntas frequentes e respostas para quem contrata ou oferece um talento.',
                          'og:title': 'Perguntas frequentes |WORBBY = WORK + HOBBY',
                          'og:description': 'Tem dúvidas sobre o funcionamento da WORBBY? Perguntas frequentes e respostas para quem contrata ou oferece um talento.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'faq', redirectTo: 'perguntas-frequentes', pathMatch: 'full' },

                    {
                      path: 'perguntas-frequentes/:tab', component: FaqComponent, data: {
                        meta: {
                          title: 'Perguntas frequentes |WORBBY = WORK + HOBBY',
                          description: 'Tem dúvidas sobre o funcionamento da WORBBY? Perguntas frequentes e respostas para quem contrata ou oferece um talento.',
                          'og:title': 'Perguntas frequentes |WORBBY = WORK + HOBBY',
                          'og:description': 'Tem dúvidas sobre o funcionamento da WORBBY? Perguntas frequentes e respostas para quem contrata ou oferece um talento.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'faq/:tab', redirectTo: 'perguntas-frequentes/:tab', pathMatch: 'full' },

                    {
                      path: 'como-funciona', component: HowDoesItWorkComponent, data: {
                        meta: {
                          title: 'Como funciona a plataforma | WORBBY = WORK + HOBBY',
                          description: 'Poste uma tarefa - Selecione um talento - Combine os detalhes - Contrate - Confirme - Pague e avalie! É simples!',
                          'og:title': 'Como funciona a plataforma | WORBBY = WORK + HOBBY',
                          'og:description': 'Poste uma tarefa - Selecione um talento - Combine os detalhes - Contrate - Confirme - Pague e avalie! É simples!',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'how-does-it-work', redirectTo: 'como-funciona', pathMatch: 'full' },

                    {
                      path: 'como-funciona-w', component: HowDoesItWorkWorbbiorComponent, data: {
                        meta: {
                          title: 'Como funciona a plataforma para que tem talento | WORBBY ',
                          description: 'Cadastre suas habilidades - Procure ou receba tarefa - Combine os detalhes - Monstre seu talento - Receba o dinheiro! É simples!',
                          'og:title': 'Como funciona a plataforma para que tem talento | WORBBY ',
                          'og:description': 'Cadastre suas habilidades - Procure ou receba tarefa - Combine os detalhes - Monstre seu talento - Receba o dinheiro! É simples!',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'how-does-it-work-w', redirectTo: 'como-funciona-w', pathMatch: 'full' },

                    {
                      path: 'seguro', component: InsuranceComponent, data: {
                        meta: {
                          title: 'Confiança e segurança |WORBBY = WORK + HOBBY',
                          description: 'Contrate pessoas talentosas para realizar tarefas de forma segura e confiável. Veja os procedimentos que ajudam a manter nossa comunidade em segurança.',
                          'og:title': 'Confiança e segurança |WORBBY = WORK + HOBBY',
                          'og:description': 'Contrate pessoas talentosas para realizar tarefas de forma segura e confiável. Veja os procedimentos que ajudam a manter nossa comunidade em segurança.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'insurance', redirectTo: 'seguro', pathMatch: 'full' },
                    {
                      path: 'postar-tarefa', component: PostTaskComponent, data: {
                        meta: {
                          title: 'Precisa de ajuda em uma tarefa? Encontre um talento |WORBBY',
                          description: 'Poste qual tarefa você precisa realizar e receba ofertas da nossa comunidade de talentos. São pessoas habilidosas em diversas áreas prontas para te ajudar.',
                          'og:title': 'Precisa de ajuda em uma tarefa? Encontre um talento |WORBBY',
                          'og:description': 'Poste qual tarefa você precisa realizar e receba ofertas da nossa comunidade de talentos. São pessoas habilidosas em diversas áreas prontas para te ajudar.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'post-a-task', redirectTo: 'postar-tarefa', pathMatch: 'full' },

                    { path: 'post-a-task/:activityUserId', redirectTo: 'postar-tarefa', pathMatch: 'full' },
                    {
                      path: 'postar-tarefa/:activityUserId', component: PostTaskComponent, data: {
                        meta: {
                          title: 'Precisa de ajuda em uma tarefa? Encontre um talento |WORBBY',
                          description: 'Poste qual tarefa você precisa realizar e receba ofertas da nossa comunidade de talentos. São pessoas habilidosas em diversas áreas prontas para te ajudar.',
                          'og:title': 'Precisa de ajuda em uma tarefa? Encontre um talento |WORBBY',
                          'og:description': 'Poste qual tarefa você precisa realizar e receba ofertas da nossa comunidade de talentos. São pessoas habilidosas em diversas áreas prontas para te ajudar.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    {
                      path: 'worbby-task/:worbbyTaskId', component: WorbbyTaskComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                    {
                      path: 'suporte', component: SupportComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                    { path: 'support', redirectTo: 'suporte', pathMatch: 'full' },

                    {
                      path: 'termos-de-uso', component: TermsAndConditionsComponent, data: {
                        meta: {
                          title: 'Termos de uso |WORBBY = WORK + HOBBY',
                          description: 'Tudo sobre as condições de funcionamento e termos de uso da plataforma Worbby.',
                          'og:title': 'Termos de uso |WORBBY = WORK + HOBBY',
                          'og:description': 'Tudo sobre as condições de funcionamento e termos de uso da plataforma Worbby.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'terms-and-conditions', redirectTo: 'termos-de-uso', pathMatch: 'full' },

                    {
                      path: 'tarefas', component: FindTasksComponent, data: {
                        meta: {
                          title: 'Ganhe uma renda extra com o seu talento | WORBBY',
                          description: 'Ganhe dinheiro fazendo o que gosta. Ofereça as suas habilidades para outras pessoas. São diversas opções de atividades.',
                          'og:title': 'Ganhe uma renda extra com o seu talento | WORBBY',
                          'og:description': 'Ganhe dinheiro fazendo o que gosta. Ofereça as suas habilidades para outras pessoas. São diversas opções de atividades.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'find-a-tasks', redirectTo: 'tarefas', pathMatch: 'full' },

                    {
                      path: 'talentos', component: FindTalentComponent, data: {
                        meta: {
                          title: 'Encontre talentos para realizar tarefas para você | WORBBY',
                          description: 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:title': 'Encontre talentos para realizar tarefas para você | WORBBY',
                          'og:description': 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'find-a-talents', redirectTo: 'talentos', pathMatch: 'full' },

                    {
                      path: 'talentos/:interestCenterId', component: FindTalentComponent, data: {
                        meta: {
                          title: 'Encontre talentos para realizar tarefas para você | WORBBY',
                          description: 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:title': 'Encontre talentos para realizar tarefas para você | WORBBY',
                          'og:description': 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'find-a-talents/:interestCenterId', redirectTo: 'talentos/:interestCenterId', pathMatch: 'full' },

                    {
                      path: 'talentos-t/:filter', component: FindTalentComponent, data: {
                        meta: {
                          title: 'Encontre talentos para realizar tarefas para você | WORBBY',
                          description: 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:title': 'Encontre talentos para realizar tarefas para você | WORBBY',
                          'og:description': 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'find-a-talents-t/:filter', redirectTo: 'talentos-t/:filter', pathMatch: 'full' },

                    {
                      path: 'talentos-f/:feature', component: FindTalentComponent, data: {
                        meta: {
                          title: 'Encontre talentos para realizar tarefas para você | WORBBY',
                          description: 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:title': 'Encontre talentos para realizar tarefas para você | WORBBY',
                          'og:description': 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'find-a-talents-f/:feature', redirectTo: 'talentos-f/:feature', pathMatch: 'full' },

                    {
                      path: 'seja-um-worbbior', component: BecomeWorbbiorComponent, data: {
                        meta: {
                          title: 'Ganhe uma renda extra com seu o talento |WORBBY',
                          description: 'Faça parte da nossa comunidade de talentos e ganhe dinheiro fazendo o que você ama. Conecte-se com pessoas que precisam das suas habilidades.',
                          'og:title': 'Ganhe uma renda extra com seu o talento |WORBBY',
                          'og:description': 'Faça parte da nossa comunidade de talentos e ganhe dinheiro fazendo o que você ama. Conecte-se com pessoas que precisam das suas habilidades.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    { path: 'become-a-worbbior', redirectTo: 'seja-um-worbbior', pathMatch: 'full' },

                    {
                      path: 'worbbior/pagina/:worbbiorId', component: PageWorbbiorComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                    { path: 'worbbior/page/:worbbiorId', redirectTo: 'worbbior/pagina/:worbbiorId', pathMatch: 'full' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class PublicRoutingModule { }