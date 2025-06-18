import {Component, OnInit} from '@angular/core';
import {PasswordPolicy} from '../model/password-policy.model';
import {PasswordPolicyService} from '../services/password-policy.service';
import {NgForOf} from '@angular/common';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIcon} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UpdatePasswordPolicy} from '../model/update-password-policy.model';

@Component({
  selector: 'app-password-policy',
  imports: [
    NgForOf,
    MatCheckbox,
    MatIcon
  ],
  templateUrl: './password-policy.component.html',
  styleUrl: './password-policy.component.css'
})
export class PasswordPolicyComponent implements OnInit {

  isChanged: Boolean = false;

  oldPolicies: PasswordPolicy[] = [];
  policies: PasswordPolicy[] = [];

  constructor(private passwordPolicyService: PasswordPolicyService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.loadPasswordPolicies();
  }

  loadPasswordPolicies() {
    this.passwordPolicyService.getAllPolicies().subscribe(
      data => {
        this.policies = data.body;
        this.oldPolicies = JSON.parse(JSON.stringify(data.body));
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
        active: policy.active
    }));

    this.passwordPolicyService.updatePolicies(modifiedPolicies).subscribe({
      next: (res) => {
        // this.isChanged = false;
        this.snackBar.open('Policies updated Successfully.', 'Close', {duration: 3000} );
      }, error: (err) => {
        this.snackBar.open('Updates Failed!', 'Close', {duration: 3000});
      }
    })
  }

}
