import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css']
})
export class SuccessDialogComponent implements OnInit {

  modalRef!: BsModalRef;
  @Input()
  header!: string;
  @Input()
  subheader!: string;
  @Input()
  message!: string;
  @ViewChild('succesDialog')
  succesDialog!: TemplateRef<any>;

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void{
  }

  openModal(): void {
    this.modalRef = this.modalService.show(this.succesDialog, {class: 'modal-sm'});
  }

  closeModal(): void{
    this.modalRef.hide();
  }

}
