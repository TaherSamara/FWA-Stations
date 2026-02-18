import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class ToastrsService {

    constructor(private toastr: ToastrService) {
    }

    Showerror(message: string) {
        this.toastr.error(message, '', { positionClass: "toast-top-left" });
    }

    Showsuccess(message: string) {
        this.toastr.success(message, '', { positionClass: "toast-top-left" });
    }

    Showinfo(message: string) {
        this.toastr.info(message, '', { positionClass: "toast-top-left" });
    }

    ShowWarning(message: string) {
        this.toastr.warning(message, '', { positionClass: "toast-top-left", timeOut: 5000 });
    }
}