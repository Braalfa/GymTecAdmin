import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import {ClientService} from "../services/client.service";
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {AfterViewInit, Component, ElementRef, enableProdMode, ViewChild} from '@angular/core';
import {DxPivotGridComponent} from 'devextreme-angular';
import {Planilla} from "../models/Planilla";
import {round} from "@popperjs/core/lib/utils/math";
import 'devextreme/integration/jquery';
if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}
@Component({
  selector: 'app-generacion-planilla',
  templateUrl: './generacion-planilla.component.html',
  styleUrls: ['./generacion-planilla.component.css']
})
export class GeneracionPlanillaComponent implements AfterViewInit{
  errorMsg: string = "";
 // @ViewChild(FailDialogComponent) failDialogComponent: FailDialogComponent;

  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent | undefined;
  title = 'Consumo Energético por Periodo';
  monthlydata: Planilla[] = [];
  dataSource: any;
  onCellPrepared(e:any){e.cellElement.find(".dx-expand-icon-container").empty()};
  onCellClick(e:any){ e.cancel = true};

  /**
   * Constructor del componente
   * @param clientService
   * @param router servicio
   * @param elementRef servicio
   */
  constructor(private clientService: ClientService,
              private router: Router,
              private elementRef: ElementRef) {
    this.customizeTooltip = this.customizeTooltip.bind(this);
    this.clientService.getPlanilla().subscribe(
      d=>{
        this.monthlydata=d;
        this.dataSource = {
          store: this.monthlydata,
          fields: [{
            caption: 'Sucursal',
            dataField: 'NombreSucursal',
            area: 'row'
          },{
            caption: 'Cédula',
            dataField: 'NumeroCedula',
            area: 'row'
          }, {
            caption: 'Nombre',
            dataField: 'Nombre',
            area: 'row'
          }, {
            dataField: 'Periodo',
            dataType: 'string',
            area: 'column',
          },
          {
            caption: 'Monto',
            dataField: 'Monto',
            dataType: 'number',
            summaryType: 'sum',
            customizeText: (cellInfo: any) => cellInfo.value !== undefined ? cellInfo.value + ' ₡' : '',
            area: 'data'
          },
          {
            caption: 'Horas/Clases/Meses',
            dataField: 'Unidades',
            dataType: 'number',
            summaryType: 'sum',
            area: 'data'
          }],
        };
      }, e=>this.handleError(e))
  }

  /**
   * Metodo para mostrar el chart al inicio
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      // @ts-ignore
      const dataSource = this.pivotGrid.instance.getDataSource();
      dataSource.expandAll('NombreSucursal');
      dataSource.expandAll('NumeroCedula');
      dataSource.expandAll('Nombre');
      dataSource.expandAll('Periodo');
    }, 0);
  }

  customizeTooltip(args: any): any {
    return {
      html: args.seriesName + ' | Total ' + args.valueText + ' ₡</div>'
    };
  }

  /**
   * Metodo para exportar el reporte a pdf
   */
  exportAsPDF(): void {
    const data = document.getElementById('general-block');
    if (data) {
      html2canvas(data, {
        scale:5
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png', 4);
        const doc = new jsPDF('l', 'cm', 'a4');
        const imgWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgHeight = round(canvas.height * imgWidth / canvas.width);
        let heightLeft = imgHeight;
        let position = 0;
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.autoPrint({variant: 'non-conform'});
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
        //doc.save('reporteMensual.pdf');
      });
    }
  }

  /**
   * Metodo para mostrar mensajes de error
   * @param errorResponse error http
   */
  handleError(errorResponse: HttpErrorResponse): void {
    console.log(errorResponse.status);
    switch (errorResponse.status) {

      case 0:
        this.errorMsg = 'No se pudo conectar con el Servidor';
        break;
      case 404:
        this.router.navigate(['/login']);
        return;
      default:
        this.errorMsg = errorResponse.error;
        break;
    }
    const element = this.elementRef.nativeElement;

    // if (element.offsetParent !== null) {
    //   // element is  visible
    //   this.failDialogComponent.openModal();
    // }
  }

}

