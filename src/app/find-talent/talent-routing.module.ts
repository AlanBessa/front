import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TalentComponent } from './talent.component';
import { TalentPageComponent } from './talent-page.component';

@NgModule({
  imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TalentComponent,
                children: [
                    {
                      path: '', component: TalentPageComponent, data: {
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
                    // { path: 'find-a-talents', redirectTo: 'talentos', pathMatch: 'full' },

                    // {
                    //   path: 'talentos/:interestCenterId', component: FindTalentPageComponent, data: {
                    //     meta: {
                    //       title: 'Encontre talentos para realizar tarefas para você | WORBBY',
                    //       description: 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                    //       'og:title': 'Encontre talentos para realizar tarefas para você | WORBBY',
                    //       'og:description': 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                    //       'og:url': '',
                    //       'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                    //       'og:image:type': 'image/jpeg',
                    //       'og:image:width': '800',
                    //       'og:image:height': '600'
                    //     }
                    //   }
                    // },
                    // { path: 'find-a-talents/:interestCenterId', redirectTo: '/talentos/:interestCenterId', pathMatch: 'full' }, 

                    // {
                    //   path: 'talentos-t/:filter', component: FindTalentPageComponent, data: {
                    //     meta: {
                    //       title: 'Encontre talentos para realizar tarefas para você | WORBBY',
                    //       description: 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                    //       'og:title': 'Encontre talentos para realizar tarefas para você | WORBBY',
                    //       'og:description': 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                    //       'og:url': '',
                    //       'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                    //       'og:image:type': 'image/jpeg',
                    //       'og:image:width': '800',
                    //       'og:image:height': '600'
                    //     }
                    //   }
                    // },
                    // { path: 'find-a-talents-t/:filter', redirectTo: '/talentos-t/:filter', pathMatch: 'full' },

                    // {
                    //   path: 'talentos-f/:feature', component: FindTalentPageComponent, data: {
                    //     meta: {
                    //       title: 'Encontre talentos para realizar tarefas para você | WORBBY',
                    //       description: 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                    //       'og:title': 'Encontre talentos para realizar tarefas para você | WORBBY',
                    //       'og:description': 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                    //       'og:url': '',
                    //       'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                    //       'og:image:type': 'image/jpeg',
                    //       'og:image:width': '800',
                    //       'og:image:height': '600'
                    //     }
                    //   }
                    // },
                    // { path: 'find-a-talents-f/:feature', redirectTo: '/talentos-f/:feature', pathMatch: 'full' },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TalentRoutingModule { }