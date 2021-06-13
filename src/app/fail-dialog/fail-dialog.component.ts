import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-fail-dialog',
  templateUrl: './fail-dialog.component.html',
  styleUrls: ['./fail-dialog.component.css']
})
export class FailDialogComponent implements OnInit {

  modalRef!: BsModalRef;
  @ViewChild('failDialog')
  failDialog!: TemplateRef<any>;
  @Input()
  header!: string;
  @Input()
  message!: string;

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void{
  }

  openModal(): void {
    this.modalRef = this.modalService.show(this.failDialog, {class: 'modal-sm'});
  }

  closeModal(): void{
    this.modalRef.hide();
  }
}
