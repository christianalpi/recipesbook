import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentConfig, ENV_CONFIG } from 'src/environments/environment-config.interface';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class HttpModule {
  static forRoot(config: EnvironmentConfig): ModuleWithProviders<HttpModule>{
    return {
      ngModule: HttpModule,
      providers: [
        {
          provide: ENV_CONFIG,
          useValue: config
        }
      ]
    }
  }
}
