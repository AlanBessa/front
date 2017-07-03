import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './login/login-page.component';
import { RegisterPageComponent } from './register/register-page.component';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { SendTwoFactorCodeComponent } from './login/send-two-factor-code.component';
import { ValidateTwoFactorCodeComponent } from './login/validate-two-factor-code.component';

import { AccountComponent } from './account.component';

@NgModule({
  imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AccountComponent,
                children: [
                    {
                      path: 'entrar', component: LoginPageComponent, data: {
                        meta: {
                          title: 'Cadastre-se. É grátis| WORBBY = WORK + HOBBY',
                          description: 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:title': 'Cadastre-se. É grátis| WORBBY = WORK + HOBBY',
                          'og:description': 'Contrate pessoas habilidosas e apaixonadas pelo que fazem para tarefas domésticas, administrativas ou gastronômicas; reformas; festas; aulas e muito mais.',
                          'og:url': '',
                          'og:image': 'http://www.worbby.com/images/home-temporario_2.jpg',
                          'og:image:type': 'image/jpeg',
                          'og:image:width': '800',
                          'og:image:height': '600'
                        }
                      }
                    },
                    {
                      path: 'registrar/:roleName', component: RegisterPageComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                    {
                      path: 'esqueceu-a-sua-senha', component: ForgotPasswordComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                    {
                      path: 'trocar-senha', component: ResetPasswordComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                    {
                      path: 'ativacao-de-email', component: EmailActivationComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                    {
                      path: 'confirmar-email', component: ConfirmEmailComponent, data: {
                        meta: {
                          title: 'Worbby',
                          description: ''
                        }
                      }
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }