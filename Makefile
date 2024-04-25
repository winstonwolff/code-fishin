web:
	cd src; npx browser-sync start --server --files "*" --no-open --no-notify

#  $< = first prerequisite
#  $@ = target
src/%.js : src/%.coffee
	npx coffee --compile --map --output $@ $< 


deploy-staging:
	# PASS := $(shell op read "op://Private/Opalstack ssh wwolff/password")
	rsync -av -e ssh src/ wwolff@opal3.opalstack.com:apps/fish-a-tron/

