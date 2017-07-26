import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomePageComponent } from './home-page.component';

@NgModule({
  imports: [
        RouterModule.forChild([
            {
                path: '',
                component: HomeComponent,
                children: [
                    {
                      path: '', component: HomePageComponent, data: {
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
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class HomeRoutingModule { }