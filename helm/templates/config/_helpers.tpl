{{- define "certificates.fullname" -}}
{{ include "apim4elastic.fullname" . }}-certificates
{{- end }}

{{- define "certificates.name" -}}
{{ include "apim4elastic.name" . }}-certificates
{{- end }}

{{/*
Common labels
*/}}
{{- define "certificates.labels" -}}
helm.sh/chart: {{ include "apim4elastic.chart" . }}
{{ include "certificates.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "certificates.selectorLabels" -}}
app.kubernetes.io/component: certificates
app.kubernetes.io/name: {{ include "apim4elastic.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- range $key, $value := .Values.certificates.labels }}
{{ $key }}: {{ $value | quote }}
{{- end }}
{{- end }}

{{/*
Generate required certificates 
*/}}
{{- define "elastic-apim.gen-certs" -}}
{{- $altNames := list "localhost" ( printf "%s-elasticsearch" (include "apim4elastic.fullname" .) ) ( printf "%s-elasticsearch.%s" (include "apim4elastic.fullname" .) .Release.Namespace ) ( printf "%s-elasticsearch.%s.svc.cluster.local" (include "apim4elastic.fullname" .) .Release.Namespace ) ( printf "%s-apibuilder4elastic" (include "apim4elastic.fullname" .) )  ( printf "%s-kibana" (include "apim4elastic.fullname" .) ) ( printf "%s-apmserver" (include "apim4elastic.fullname" .) ) ( printf "%s-apmserver.%s" (include "apim4elastic.fullname" .) .Release.Namespace ) ( printf "%s-apmserver.%s.svc.cluster.local" (include "apim4elastic.fullname" .) .Release.Namespace ) -}}
{{- $ca := genCA "elastic-apim-ca" 365 -}}
{{- $cert := genSignedCert ( include "apim4elastic.name" . ) nil $altNames 365 $ca -}}
ca.crt: {{ $ca.Cert | b64enc }}
elasticsearch.crt: {{ $cert.Cert | b64enc }}
elasticsearch.key: {{ $cert.Key | b64enc }}
kibana.crt: {{ $cert.Cert | b64enc }}
kibana.key: {{ $cert.Key | b64enc }}
apibuilder4elastic.crt: {{ $cert.Cert | b64enc }}
apibuilder4elastic.key: {{ $cert.Key | b64enc }}
apmserver.crt: {{ $cert.Cert | b64enc }}
apmserver.key: {{ $cert.Key | b64enc }}
{{- end -}}