import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // experimentando uma função pra conseguir setar as datas da agenda automaticamente,
  // mas não está usada no html
  title = 'rev.usp';
  diasDaSemana: { nome: string, data: string }[] = [];

  constructor(){
    this.gerarSemana();
  }

  gerarSemana(){
    const hoje = new Date();
    const diaDaSemana = hoje.getDay();
    const diffSegunda = hoje.getDate() - diaDaSemana + (diaDaSemana == 0 ? -6 : 1);
    const segunda = new Date(hoje.setDate(diffSegunda));

    const nomeDias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    for (let i = 0; i < 7; i++){
      const dia = new Date(segunda);
      dia.setDate(segunda.getDate() + i);
      const dataFormatada = this.formatarData(dia);
      this.diasDaSemana.push({
        nome: nomeDias[i],
        data: dataFormatada
      });
    }
  }

  formatarData(data: Date): string {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
  }
}
