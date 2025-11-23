import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services/common.service';
import { ApiService } from '../../../core/services/api.service';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminProfileResolverService {
  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  resolve(): Observable<any> {
    let getAdminDetails = of({});

    getAdminDetails = this.apiService.GetAdminByID({
      id: this.commonService.userInfo?.id,
    });

    return forkJoin({
      getAdminDetails,
    });
  }
}
