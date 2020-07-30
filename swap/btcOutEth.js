#include <bits/stdc++.h>
using namespace std;
int main()
{
    int t,n,k;
    cin>>t;
    while(t--){
        cin>>n>>k;
        for (int i=0; i<n; i++){
            for (int j=0; j<k;j++){
                cout << "*";
            }
             cout<<'\n';
        }
        cout<<'\n';
    }
   
    return 0;
}





#include <bits/stdc++.h>
using namespace std;

int main(){
    
    int m[100], n[100],a,b;
    
    cin>>a;
    
    for (int i=0; i<a;i++){
        cin>>m[i];
    }
    
    cin>>b;
    
    for (int j=0; j<b;j++){
        cin>>n[j];
    }
    
  for (int c=0; c<a; c++){
      for( int d=0; d<b; d++){
          if ( m[c] != n[d]){
              cout<<m[c]<<'\n';  
          }
      }
  }
}
