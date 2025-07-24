import {Component, OnInit} from '@angular/core';
import {PasswordPolicy} from '../model/password-policy.model';
import {PasswordPolicyService} from '../services/password-policy.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIcon} from '@angular/material/icon';
import {UpdatePasswordPolicy} from '../model/update-password-policy.model';
import {MatMiniFabButton} from '@angular/material/button';
import {ToastrMsgService} from '../shared/toastr-msg.service';

@Component({
  selector: 'app-password-policy',
  imports: [
    NgForOf,
    MatCheckbox,
    MatIcon,
    NgIf,
    MatMiniFabButton,
    NgClass
  ],
  templateUrl: './password-policy.component.html',
  standalone: true,
  styleUrl: './password-policy.component.css'
})
export class PasswordPolicyComponent implements OnInit {

  isChanged: Boolean = false;
  oldPolicies: PasswordPolicy[] = [];
  policies: PasswordPolicy[] = [];

  constructor(
    private passwordPolicyService: PasswordPolicyService,
    private toastr: ToastrMsgService) {
  }

  ngOnInit() {
    this.loadPasswordPolicies();
  }

  loadPasswordPolicies() {
    this.passwordPolicyService.getAllPolicies().subscribe(
      data => {
        this.policies = data.body;
        // this.count = this.policies.map(policy => policy.length );
        this.oldPolicies = JSON.parse(JSON.stringify(data.body));           //clean copy of the original, undefined haru hatauxa
      }
    )
  }

  setStatus(policyCode: string) {
    this.policies = this.policies.map(policy => {
      if (policy.code === policyCode) {
        return {...policy, active: !policy.active}
      }
      return policy;
    });
    this.isChanged = this.policies.some((p, index) => p.active !== this.oldPolicies[index].active);
  }

  savePolicy(){
    const modifiedPolicies: UpdatePasswordPolicy[] = this.policies.map(policy => ({
      code: policy.code,
      active: policy.active,
      length: policy.length
    }));

    this.passwordPolicyService.updatePolicies(modifiedPolicies).subscribe({
      next: (res) => {
        this.loadPasswordPolicies();
        this.toastr.success("Policies updated successfully");
      }, error: (err) => {
        this.toastr.error('');
      }
    })
  }

  increaseCount(index: number) {
    this.policies[index].length++;

  }

  decreaseCount(index: number) {
    if(this.policies[index].length > 0){
      this.policies[index].length--;
    }
  }

  resetPolicy() {
    this.loadPasswordPolicies();
  }

  getStatusClass(status: boolean) {
    if(status) {
      return 'active-status';
    }else {
      return 'inactive-status';
    }
  }

}
